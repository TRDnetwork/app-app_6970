export default function ContactNotification({ name, email, message }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Portfolio Contact</title>
        <style>
          body { font-family: 'Satoshi', sans-serif; background-color: #faf8f5; color: #1a2e1a; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; padding: 30px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(26, 46, 26, 0.1); }
          .header { border-bottom: 1px solid #e9e5dd; padding-bottom: 16px; margin-bottom: 24px; }
          .header h1 { margin: 0; font-family: 'Fraunces', serif; font-size: 1.75rem; color: #1a2e1a; letter-spacing: -0.05em; }
          .content p { line-height: 1.6; margin: 16px 0; }
          .content strong { color: #e66000; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e9e5dd; font-size: 0.875rem; color: #4a4a4a; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Message</h1>
          </div>
          <div class="content">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          <div class="footer">
            <p>Sent from your Portfolio Pro contact form.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}