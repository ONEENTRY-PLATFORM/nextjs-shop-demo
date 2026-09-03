/**
 * Line separators that are legal inside a JSON string but count as line
 * terminators in JavaScript source.
 *
 * Built with `new RegExp` rather than written as regex literals on purpose: a
 * literal `/…/` cannot contain a raw U+2028 — it *is* a line break to the
 * parser — so the pattern has to arrive as an escape inside a string.
 */
const LINE_SEPARATOR = new RegExp('\\u2028', 'g');
const PARAGRAPH_SEPARATOR = new RegExp('\\u2029', 'g');

/**
 * serializeJsonLd — safely serialize a structured-data object for inlining in a
 * `<script type="application/ld+json">` tag.
 *
 * `JSON.stringify` alone is unsafe inside an inline `<script>`: any `<` in a
 * string value — most dangerously the literal `</script>` — closes the tag
 * early and lets the remainder of the (CMS-authored) value be parsed as HTML, a
 * stored-XSS vector even though the content is admin-entered. Escaping `<`, `>`
 * and `&` to their unicode escapes keeps the JSON semantically identical (the
 * `application/ld+json` parser decodes them back) while making a tag break-out
 * impossible.
 *
 * U+2028 / U+2029 are escaped for the same reason one step further out: both
 * are legal inside a JSON string but count as line terminators in JavaScript,
 * so the moment this helper is reused for an inline state script — the usual
 * next step after JSON-LD — an unescaped one truncates the statement.
 * @param   {object} data - JSON-LD structured-data object.
 * @returns {string}      Escaped JSON string, safe to inline as script content.
 */
export const serializeJsonLd = (data: object): string =>
  JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(LINE_SEPARATOR, '\\u2028')
    .replace(PARAGRAPH_SEPARATOR, '\\u2029');
