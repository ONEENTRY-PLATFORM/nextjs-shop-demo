import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes HTML content to prevent XSS (Cross-Site Scripting) attacks.
 * Removes potentially dangerous elements like scripts, event handlers, and unsafe attributes.
 * Uses DOMPurify library with a whitelist approach to allow only safe HTML tags and attributes.
 * @param   {string} dirty - Untrusted HTML string from external sources (CMS, user input, etc.)
 * @returns {string}       Safe HTML string with malicious code removed
 * @example
 * ```typescript
 * const userInput = '<img src=x onerror="alert(1)"> <p>Hello</p>';
 * const safe = sanitizeHTML(userInput);
 * // Returns: '<img src="x"> <p>Hello</p>' (onerror removed)
 * ```
 */
export const sanitizeHTML = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    /** Allow only safe HTML tags for content formatting */
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'b',
      'em',
      'i',
      'u',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'a',
      'img',
      'div',
      'span',
      'blockquote',
      'code',
      'pre',
    ],
    /** Allow only safe attributes (no event handlers like onclick, onerror, etc.) */
    ALLOWED_ATTR: [
      'href',
      'src',
      'alt',
      'title',
      'class',
      'id',
      'target',
      'rel',
      'width',
      'height',
    ],
    /** Forbid all URI schemes except http, https, and mailto */
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
};
