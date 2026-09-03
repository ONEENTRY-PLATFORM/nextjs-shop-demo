import parse from 'html-react-parser';
import { getAttributeFile } from 'oneentry';
import type { IAttributeValues } from 'oneentry/types';

import { sanitizeHTML } from '@/components/utils/sanitize';

/** Optional attribute values map — accepts `undefined` so callers can pass `entity.attributeValues` directly. */
type Attrs = IAttributeValues | undefined;

/**
 * Read a `string`-typed attribute value.
 * @param   {string} name            - Attribute marker.
 * @param   {Attrs}  attributeValues - Entity `attributeValues`.
 * @returns {string}                 The string value, or `''` when missing or wrong shape.
 */
export const getString = (name: string, attributeValues: Attrs): string => {
  const attr = attributeValues?.[name];
  if (attr && typeof attr.value === 'string') {
    return attr.value;
  }
  return '';
};

/** Possible payload shape inside `text`-typed attribute `value` arrays. */
type TextValueItem = { htmlValue?: string; plainValue?: string };

/**
 * Read a `text`-typed attribute value (CMS rich text).
 *
 * The CMS stores text attributes as `value: [{ htmlValue, plainValue }]`.
 * Returns sanitized parsed HTML (when `type === 'html'`) or the plain string.
 * @param   {string}                            name            - Attribute marker.
 * @param   {Attrs}                             attributeValues - Entity `attributeValues`.
 * @param   {string}                            type            - Output mode: `'plain'` (default) or `'html'`.
 * @returns {string | ReturnType<typeof parse>}                 Plain string, parsed JSX, or `''`.
 */
export const getText = (
  name: string,
  attributeValues: Attrs,
  type: 'html' | 'plain' = 'plain',
): string | ReturnType<typeof parse> => {
  const attr = attributeValues?.[name];
  if (!attr || !Array.isArray(attr.value) || attr.value.length === 0) {
    return '';
  }
  const text = attr.value[0] as TextValueItem | undefined;
  if (!text || typeof text !== 'object') {
    return '';
  }
  if (type === 'html' && typeof text.htmlValue === 'string') {
    return parse(sanitizeHTML(text.htmlValue));
  }
  return typeof text.plainValue === 'string' ? text.plainValue : '';
};

/**
 * Read an `image` attribute value and return its URL.
 *
 * The single-vs-array shape (products answer with an object, pages / blocks /
 * `groupOfImages` with an array) is handled by the SDK's own
 * {@link getAttributeFile}, which also replaces the local file type this helper
 * used to declare — `IAttributeFile` has been exported since SDK 1.0.163.
 * @param   {string} name            - Attribute marker.
 * @param   {Attrs}  attributeValues - Entity `attributeValues`.
 * @param   {string} type            - Which URL to return: `'image'` (full) or `'preview'`.
 * @returns {string}                 Image URL or `''` when missing.
 */
export const getImageUrl = (
  name: string,
  attributeValues: Attrs,
  type: 'image' | 'preview' = 'image',
): string => {
  const file = getAttributeFile(attributeValues?.[name]);
  if (!file) {
    return '';
  }
  /**
   * `IAttributeFile.previewLink` is typed as the preview map, but an upload made
   * without a preview template answers with a plain string (`''`, or a legacy
   * URL). The narrow read keeps the previous behaviour: return that string when
   * it is one, otherwise fall through to the original.
   */
  const legacyPreview = (file as { previewLink?: unknown }).previewLink;
  if (
    type === 'preview' &&
    typeof legacyPreview === 'string' &&
    legacyPreview
  ) {
    return legacyPreview;
  }
  return typeof file.downloadLink === 'string' ? file.downloadLink : '';
};

/**
 * Read the CMS-generated low-quality preview (base64 data URI) of an `image`.
 *
 * When the CMS has generated previews, an `image` value carries
 * `previewLink: { default: [dataURI, previewUrl], preview: [...] }`; the first
 * `default` entry is a tiny base64 data URI — the ideal Next.js `blurDataURL`.
 * Returns `''` when no preview exists (`previewLink` is `''` or absent), which
 * signals callers to fall back to a generated LQIP.
 * @param   {string} name            - Attribute marker.
 * @param   {Attrs}  attributeValues - Entity `attributeValues`.
 * @returns {string}                 Base64 data-URI blur, or `''` when absent.
 */
export const getImagePreview = (
  name: string,
  attributeValues: Attrs,
): string => {
  const preview = getAttributeFile(attributeValues?.[name])?.previewLink;
  if (preview && typeof preview === 'object') {
    const base64 = preview.default?.[0];
    if (typeof base64 === 'string') {
      return base64;
    }
  }
  return '';
};
