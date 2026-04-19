import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { sanitizeInput } from '../../src/lib/sanitize';

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_TO = process.env.EMAIL_TO || 'hello@yourportfolio.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message, 'bot-field': botField } = req.body;

  // Honeypot check
  if (botField) {
    return res.status(200).json({ success: true }); // Silent success to fool bots
  }

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
  }

  // Sanitize inputs
  const cleanName = sanitizeInput(name.trim());
  const cleanEmail = sanitizeInput(email.trim());
  const cleanMessage = sanitizeInput(message.trim());

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  try {
    // Rate limiting with Upstash Redis (configured in Vercel)
    const ip = req.headers['x-forwarded-for'] || 'unknown';
    const rateLimitRes = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/pf/call/contact_form_rate_limit/${ip}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keys: [`rate_limit:${ip}`],
        args: ['10', '3600'], // 10 requests per hour
      }),
    });

    const rateLimitData = await rateLimitRes.json();
    if (rateLimitData.result && rateLimitData.result[0] === 0) {
      return res.status(429).json({ message: 'Too many requests. Please try again later.' });
    }

    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [EMAIL_TO],
      subject: `New message from ${cleanName} via your portfolio`,
      reply_to: cleanEmail,
      html: await renderContactNotification({ name: cleanName, email: cleanEmail, message: cleanMessage }),
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ message: 'Failed to send email. Please try again.' });
    }

    // Optional: Send confirmation email to user
    await resend.emails.send({
      from: 'Portfolio Pro <onboarding@resend.dev>',
      to: [cleanEmail],
      subject: 'Thanks for reaching out!',
      html: await renderContactConfirmation({ name: cleanName }),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ message: 'An unexpected error occurred. Please try again.' });
  }
}

async function renderContactNotification({ name, email, message }: { name: string; email: string; message: string }) {
  const html = await import('../../src/emails/contact-notification.js');
  return html.default({ name, email, message });
}

async function renderContactConfirmation({ name }: { name: string }) {
  const html = await import('../../src/emails/contact-confirmation.js');
  return html.default({ name });
}