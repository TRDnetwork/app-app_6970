# API Documentation

## Overview

The Portfolio Pro site includes a single serverless API endpoint for handling contact form submissions. All other content is static and served directly from the frontend.

## Base URL

```
https://yourportfolio.com/api
```

> Replace `yourportfolio.com` with your actual domain.

## Endpoint: Contact Form Submission

### `POST /api/contact`

Handles submission of the contact form with spam protection, rate limiting, and email delivery.

#### Request

**Headers**:
```
Content-Type: application/json
```

**Body** (application/json):
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Sender's full name |
| `email` | string | Yes | Sender's email address |
| `message` | string | Yes | Message content |
| `bot-field` | string | No | Honeypot field (should be empty) |

**Example Request**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "I love your work and would like to discuss a potential project.",
  "bot-field": ""
}
```

**cURL Command**:
```bash
curl -X POST https://yourportfolio.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john@example.com",
    "message": "Let's work together!",
    "bot-field": ""
  }'
```

#### Responses

| Status | Response Body | Description |
|--------|---------------|-------------|
| `200 OK` | `{"success": true}` | Form submitted successfully. Note: This is also returned silently for honeypot triggers. |
| `400 Bad Request` | `{"message": "Please fill in all required fields."}` | Missing required fields or invalid email format. |
| `405 Method Not Allowed` | `{"message": "Method not allowed"}` | Only POST requests are accepted. |
| `429 Too Many Requests` | `{"message": "Too many requests. Please try again later."}` | Rate limit exceeded (10 submissions per hour per IP). |
| `500 Internal Server Error` | `{"message": "Failed to send email. Please try again."}` | Server-side error during email sending. |

#### Success Flow

1. Form data is validated
2. Honeypot check passes (field is empty)
3. Rate limit check passes
4. Email is sent to site owner via Resend
5. Confirmation email is sent to user
6. `200` response returned

#### Security Features

- **Honeypot Protection**: If `bot-field` contains any value, returns `200` without processing (to fool bots)
- **Rate Limiting**: Uses Upstash Redis to limit submissions to 10 per hour per IP address using a sliding window algorithm
- **Input Sanitization**: All inputs are sanitized server-side using `isomorphic-dompurify` to prevent XSS attacks
- **Email Validation**: Server-side regex validation of email format
- **Environment Isolation**: API key and sensitive data stored in environment variables (never exposed to client)

#### Error Handling

- **Validation Errors**: `400` with descriptive message
- **Rate Limiting**: `429` with clear user message
- **Email Service Failure**: `500` with generic message (specific errors logged server-side)
- **Network/Redis Issues**: `500` with generic message (fail-open behavior for rate limiting)

#### Email Templates

Two email templates are used:

1. **Notification Email** (`contact-notification.js`):
   - Sent to: Site owner (`EMAIL_TO`)
   - From: `Portfolio Contact <onboarding@resend.dev>`
   - Subject: `New message from {name} via your portfolio`
   - Includes: Sender name, email, and message content

2. **Confirmation Email** (`contact-confirmation.js`):
   - Sent to: User who submitted form
   - From: `Portfolio Pro <onboarding@resend.dev>`
   - Subject: `Thanks for reaching out!`
   - Includes: Personalized thank you message

#### Monitoring

- **Server Logs**: All requests and errors are logged in Vercel Logs
- **Error Tracking**: Server-side errors reported to Sentry
- **Analytics**: Form submissions tracked in PostHog
- **Email Delivery**: Delivery status available in Resend Dashboard

#### Rate Limiting Details

- **Implementation**: Upstash Redis REST API
- **Limits**: 10 requests per 3600 seconds (1 hour) per IP address
- **Algorithm**: Sliding window counter
- **Fail-Open**: If Redis is unreachable, requests proceed (with error logged to Sentry)
- **Headers Used**: `x-forwarded-for` for IP detection

**Rate Limit Request**:
```http
POST ${UPSTASH_REDIS_REST_URL}/pf/call/contact_form_rate_limit/{ip}
Authorization: Bearer ${UPSTASH_REDIS_REST_TOKEN}
Content-Type: application/json

{
  "keys": ["rate_limit:{ip}"],
  "args": ["10", "3600"]
}
```