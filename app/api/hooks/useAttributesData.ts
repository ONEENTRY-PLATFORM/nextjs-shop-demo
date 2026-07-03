import parse from 'html-react-parser';
import type { IAttributeValues } from 'oneentry/dist/base/utils';

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
 * CMS-generated preview payload attached to an `image` value once previews exist.
 * Each tuple is `[base64DataURI, previewUrl]`; `default[0]` is a tiny base64 blur.
 */
type PreviewLinkObject = { default?: string[]; preview?: string[] };

/**
 * Possible payload shape inside `image` / `groupOfImages` attribute values.
 * `previewLink` is `''` (or absent) when no preview has been generated, or a
 * {@link PreviewLinkObject} once the CMS has produced low-quality previews.
 */
type ImageValueItem = {
  downloadLink?: string;
  previewLink?: string | PreviewLinkObject;
};

/**
 * Read an `image` attribute value and return its URL.
 *
 * The SDK normalizes `image` differently per entity:
 * - **Products** → `value` is an object;
 * - **Pages / Blocks / `groupOfImages`** → `value` is an array of objects.
 *
 * This helper handles both shapes transparently.
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
  const attr = attributeValues?.[name];
  if (!attr || attr.value == null) {
    return '';
  }
  const value = attr.value as ImageValueItem | ImageValueItem[];
  const first: ImageValueItem | undefined = Array.isArray(value)
    ? value[0]
    : value;
  if (!first || typeof first !== 'object') {
    return '';
  }
  if (type === 'preview' && typeof first.previewLink === 'string') {
    return first.previewLink;
  }
  return typeof first.downloadLink === 'string' ? first.downloadLink : '';
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
  const attr = attributeValues?.[name];
  if (!attr || attr.value == null) {
    return '';
  }
  const value = attr.value as ImageValueItem | ImageValueItem[];
  const first: ImageValueItem | undefined = Array.isArray(value)
    ? value[0]
    : value;
  const preview = first?.previewLink;
  if (preview && typeof preview === 'object') {
    const base64 = preview.default?.[0];
    if (typeof base64 === 'string') {
      return base64;
    }
  }
  return '';
};
