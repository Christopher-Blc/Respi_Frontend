/**
 * Strips characters that have no legitimate use in user display text
 * but are commonly used in XSS / injection vectors.
 *
 * Intentionally preserved: hyphens (-), apostrophes ('), periods (.),
 * commas (,), spaces, and other characters valid in names / addresses.
 *
 * Stripped: < > " & ; ` and the literal string "javascript:"
 */
export const sanitizeInput = (text: string): string =>
  text
    .replace(/javascript:/gi, '')
    .replace(/[<>"&;`]/g, '');
