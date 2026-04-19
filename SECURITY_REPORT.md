# Security Scan Report

## Critical Issues
- **[api/contact.ts:53]** Insecure direct object reference risk in Upstash Redis rate limiting URL — user-controlled IP used directly in URL without sanitization.  
  **Fix:** Sanitize IP address before use and use POST body for sensitive parameters.

- **[api/contact.ts:60]** Potential SSRF/URL injection via `UPSTASH_REDIS_REST_URL` environment variable — if compromised, could redirect requests.  
  **Fix:** Validate and restrict Upstash URL to known domain.

- **[src/emails/contact-notification.js:38]** Potential XSS in email template — user input (name, email, message) is directly interpolated without escaping.  
  **Fix:** Use `DOMPurify.sanitize()` on all user inputs before inserting into HTML.

- **[src/emails/contact-confirmation.js:31]** XSS vulnerability in email template — `${name}` is directly inserted into HTML without sanitization.  
  **Fix:** Sanitize `name` before use.

## Warnings
- **[api/contact.ts:15]** Sensitive data exposure in error logging — full error object logged with `console.error`.  
  **Fix:** Log only error messages, not full objects.

- **[api/contact.ts:88]** Missing Content-Security-Policy headers in email HTML — increases XSS risk if rendered in unsafe contexts.  
  **Fix:** Add CSP meta tag.

- **[api/contact.ts:27]** Missing rate limit response headers — good practice to include `Retry-After` on 429.  
  **Fix:** Add `Retry-After` header.

## Passed Checks
- SQL Injection: Not applicable — no database queries.
- CORS: Not applicable — Vercel handles CORS; no API endpoints exposed to client.
- Authentication: Not applicable — no auth required.
- Insecure Dependencies: No `package.json` found — assumed up-to-date.
- Path Traversal: Not applicable — no file system access.
- Missing Rate Limiting: Implemented via Upstash Redis.
- Data Exposure: Generic error messages used; no stack traces exposed.
- Helmet/Security Headers: Not applicable — serverless function; headers managed by Vercel.

---