/**
 * Security utilities for handling user-controlled values.
 */

/**
 * Convert a user-entered URL into a safe HTTP/HTTPS URL.
 *
 * Allowed:
 *   https://example.com
 *   http://example.com
 *   example.com
 *
 * Rejected:
 *   javascript:...
 *   data:...
 *   vbscript:...
 *   file:...
 *   mailto:...
 *   tel:...
 *   malformed URLs
 *
 * @param {unknown} value
 * @returns {string}
 */
export function sanitizeExternalUrl(value) {
  if (typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  // If the user did not provide a protocol, assume HTTPS.
  const normalized = /^[a-z][a-z0-9+.-]*:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(normalized);

    // Only normal web URLs are allowed.
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return '';
    }

    return url.href;
  } catch {
    return '';
  }
}