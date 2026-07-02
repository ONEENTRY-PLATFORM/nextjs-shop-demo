/**
 * Review form field markers (form `comment_to_product`), verified against the
 * live API on 2026-07-02: `rating` (integer, value comes as a string),
 * `comment_attachments` (groupOfImages, optional), `comment_description`
 * (string). See mismatch-log C.1.4.
 */
const RATING_MARKER = 'rating';
const ATTACHMENTS_MARKER = 'comment_attachments';
const CONTENT_MARKER = 'comment_description';

/** Single item of a review's `formData` array. */
type ReviewFormDataField = {
  marker?: string;
  type?: string;
  value?: unknown;
};

/** Review image attachment with a resolvable URL. */
export type ReviewAttachment = { downloadLink: string };

/**
 * Extracts review fields from a FormsData `formData` array **by marker**.
 *
 * The array shape varies per review — a plain review has `[rating, content]`,
 * one with photos `[rating, attachments, content]`, a reply only `[content]` —
 * so positional access like `formData[1].value` breaks on real data.
 * @param   {unknown} formData - The review's `formData` (may be missing or malformed).
 * @returns {object}           Extracted `rating` (0 when absent), `attachments`
 *                             (only items with a `downloadLink`), and `content` text.
 */
export const getReviewFormData = (
  formData: unknown,
): {
  rating: number;
  attachments: ReviewAttachment[];
  content: string;
} => {
  const fields: ReviewFormDataField[] = Array.isArray(formData) ? formData : [];
  const valueOf = (marker: string): unknown =>
    fields.find((field) => field?.marker === marker)?.value;

  const rating = Number(valueOf(RATING_MARKER)) || 0;

  const rawAttachments = valueOf(ATTACHMENTS_MARKER);
  const attachments = (
    Array.isArray(rawAttachments) ? rawAttachments : []
  ).filter(
    (img): img is ReviewAttachment =>
      !!img && typeof img === 'object' && 'downloadLink' in img,
  );

  const rawContent = valueOf(CONTENT_MARKER);
  const content = typeof rawContent === 'string' ? rawContent : '';

  return { rating, attachments, content };
};
