import DOMPurify from 'isomorphic-dompurify';

// Server-side sanitization to prevent XSS in email content
export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();
}