import sanitizeHtml from 'sanitize-html';

/**
 * Sanitizes HTML content to prevent XSS (Cross-Site Scripting) attacks.
 * Removes potentially dangerous elements like scripts, event handlers, and unsafe attributes.
 * Uses sanitize-html library with a whitelist approach to allow only safe HTML tags and attributes.
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
  return sanitizeHtml(dirty, {
    /** Allow only safe HTML tags for content formatting */
    allowedTags: [
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
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      '*': ['class', 'id'],
    },
    /** Allow only safe URL schemes */
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  });
};
