# 📨 Email Setup Guide for Portfolio Pro

This guide walks you through setting up transactional email delivery using Resend and Vercel.

## 1. Get Your Resend API Key

1. Go to [resend.com](https://resend.com) and sign up or log in.
2. Navigate to **API Keys** and create a new API key.
3. Copy the key (it will look like `re_12345678...`).

> 🔐 Never commit this key to version control.

## 2. Set Environment Variables in Vercel

In your Vercel project dashboard:

1. Go to **Settings > Environment Variables**.
2. Add the following variables:

| Key | Value |
|-----|-------|
| `RESEND_API_KEY` | Your Resend API key |
| `EMAIL_TO` | The email address where you want contact form messages sent (e.g., `hello@yourportfolio.com`) |
| `UPSTASH_REDIS_REST_URL` | Your Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Your Upstash Redis REST token |

> ⚠️ Use plain `RESEND_API_KEY`, NOT `VITE_RESEND_API_KEY` — the latter would expose it to the client.

## 3. Verify Your Sending Domain

1. In the Resend dashboard, go to **Domains**.
2. Click **Add Domain** and follow the steps to verify your domain (e.g., `yourportfolio.com`).
3. Once verified, emails will send from addresses like `hello@yourportfolio.com` instead of `onboarding@resend.dev`.

## 4. Frontend Integration

The frontend submits to `/api/contact` like this:

```ts
await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message, 'bot-field': '' }),
});
```

- Do **not** import or use Resend SDK on the client.
- The honeypot field (`bot-field`) is visually hidden but catches bots.

## 5. Test the Contact Form

1. Deploy your site or run locally with Vercel CLI.
2. Fill out the contact form.
3. Check:
   - You receive the notification email.
   - The user receives a confirmation email.
   - Vercel logs show no errors (`vercel logs`).

## 6. Monitor Deliverability

- Check **Resend Dashboard > Emails** for delivery status.
- Use **Vercel Logs** to debug server-side issues.
- Rate limiting is handled by Upstash Redis (10 submissions/hour per IP).

✅ Done! Your portfolio now accepts and delivers contact messages securely.