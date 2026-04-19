export default function ContactConfirmation({ name }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Message Received</title>
        <style>
          body { font-family: 'Satoshi', sans-serif; background-color: #faf8f5; color: #1a2e1a; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; padding: 30px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(26, 46, 26, 0.1); }
          .header { border-bottom: 1px solid #e9e5dd; padding-bottom: 16px; margin-bottom: 24px; }
          .header h1 { margin: 0; font-family: 'Fraunces', serif; font-size: 1.75rem; color: #e66000; letter-spacing: -0.05em; }
          .content p { line-height: 1.6; margin: 16px 0; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e9e5dd; font-size: 0.875rem; color: #4a4a4a; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Hi ${name}, thanks for reaching out!</h1>
          </div>
          <div class="content">
            <p>I've received your message and will get back to you as soon as possible.</p>
            <p>In the meantime, feel free to explore more of my work on the site.</p>
          </div>
          <div class="footer">
            <p>— Portfolio Pro</p>
          </div>
        </div>
      </body>
    </html>
  `;
}