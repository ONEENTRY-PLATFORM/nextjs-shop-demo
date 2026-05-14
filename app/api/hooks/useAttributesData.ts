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

// /**
//  * getTextWithHeader
//  *
//  * @param name
//  * @param attributeValues
//  * @param type
//  */
// export const getTextWithHeader = (
//   name: string,
//   attributeValues: any,
//   type: 'html' | 'plain' = 'plain',
// ): string | [] | any => {};

// /**
//  * Integer
//  *
//  * @param name
//  * @param attributeValues
//  * @param type
//  */
// export const useInteger = (
//   name: any,
//   attributeValues: any,
//   type: '' | '' = '',
// ): any => {};

// /**
//  * Real
//  *
//  * @param name
//  * @param attributeValues
//  * @param type
//  */
// export const useReal = (
//   name: any,
//   attributeValues: any,
//   type: '' | '' = '',
// ): any => {};

// /**
//  * Float
//  *
//  * @param name
//  * @param attributeValues
//  * @param type
//  */
// export const useFloat = (
//   name: any,
//   attributeValues: any,
//   type: '' | '' = '',
// ): any => {};

// /**
//  * Date and Time
//  *
//  * @param name
//  * @param attributeValues
//  * @param type
//  */
// export const useDateTime = (
//   name: any,
//   attributeValues: any,
//   type: '' | '' = '',
// ): any => {};

// /**
//  * Date
//  *
//  * @param name
//  * @param attributeValues
//  * @param type
//  */
// export const useDate = (
//   name: any,
//   attributeValues: any,
//   type: '' | '' = '',
// ): any => {};

// /**
//  * time
//  *
//  * @param name
//  * @param attributeValues
//  * @param type
//  */
// export const useTime = (
//   name: any,
//   attributeValues: any,
//   type: '' | '' = '',
// ): any => {};

// /**
//  * File
//  *
//  * @param name
//  * @param attributeValues
//  * @param type
//  */
// export const useFile = (
//   name: any,
//   attributeValues: any,
//   type: '' | '' = '',
// ): any => {};

/** Possible payload shape inside `image` / `groupOfImages` attribute values. */
type ImageValueItem = { downloadLink?: string; previewLink?: string };

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

// /**
//  * Group of Images
//  *
//  * @param name
//  * @param attributeValues
//  * @param type
//  */
// export const useImagesGroup = (
//   name: string,
//   attributeValues: any,
//   type: 'image' | 'preview' = 'image',
// ): string[] | [] | any => {};

// /**
//  * Radio Button
//  *
//  * @param name
//  * @param attributeValues
//  * @param type
//  */
// export const useRadio = (
//   name: string,
//   attributeValues: any,
// ): string | [] | any => {};

// /**
//  * Entity
//  *
//  * @param name
//  * @param attributeValues
//  * @param type
//  */
// export const useEntity = (
//   name: string,
//   attributeValues: any,
// ): string | [] | any => {};

// /**
//  * Integer
//  *
//  * @param name
//  * @param attributeValues
//  * @param type
//  */
// export const useList = (
//   name: string,
//   attributeValues: any,
//   type: 'html' | 'plain' = 'plain',
// ): string | [] | any => {};

// /**
//  * Time interval
//  *
//  * @param name
//  * @param attributeValues
//  * @param type
//  */
// export const useTimeInterval = (
//   name: string,
//   attributeValues: any,
// ): string | [] | any => {};

// /**
//  * JSON
//  *
//  * @param name
//  * @param attributeValues
//  * @param type
//  */
// export const useJson = (
//   name: string,
//   attributeValues: any,
// ): string | [] | any => {};
