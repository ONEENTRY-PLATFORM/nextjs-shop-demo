/* eslint-disable @typescript-eslint/no-explicit-any */
import parse from 'html-react-parser';

/**
 * Use String type
 *
 * @param name Attribute name
 * @param attributeValues The attribute values
 *
 * @returns String value or undefined
 */
export const getString = (
  name: string,
  attributeValues: Record<string, any>,
): string => {
  if (
    attributeValues?.[name] &&
    typeof attributeValues[name] === 'object' &&
    'value' in attributeValues[name] &&
    typeof attributeValues[name].value === 'string'
  ) {
    return attributeValues[name].value;
  }
  return '';
};

/**
 * Use Text type
 *
 * @param {string} name The name of the attribute
 * @param {any} attributeValues The attribute values object
 * @param {string} type of the content
 *
 * @returns HTML content
 */
export const getText = (
  name: string,
  attributeValues: any,
  type: 'html' | 'plain' = 'plain',
): string | [] | any => {
  const data = attributeValues?.[name];
  if (
    data &&
    typeof data === 'object' &&
    'value' in data &&
    Array.isArray(data.value) &&
    data.value.length > 0
  ) {
    const text = data.value[0];

    if (
      text &&
      typeof text === 'object' &&
      ('htmlValue' in text || 'plainValue' in text)
    ) {
      if (type === 'html' && typeof text.htmlValue === 'string') {
        const val = parse(text.htmlValue);
        return val;
      }
      return typeof text.plainValue === 'string' ? text.plainValue : '';
    }
  }
  return '';
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

/**
 * Use image type - extract image URL from attribute values
 *
 * @param name The name of the attribute
 * @param attributeValues The attribute values
 * @param type The type of the image
 *
 * @returns The image URL or undefined
 */
export const getImageUrl = (
  name: any,
  attributeValues: any,
  type: 'image' | 'preview' = 'image',
): string => {
  const data = attributeValues?.[name];
  if (data && typeof data === 'object' && 'value' in data) {
    const firstImage = data.value[0] || data.value;

    if (
      firstImage &&
      typeof firstImage === 'object' &&
      'downloadLink' in firstImage &&
      typeof firstImage.downloadLink === 'string'
    ) {
      if (type === 'preview') {
        return firstImage.previewLink;
      } else {
        return firstImage.downloadLink;
      }
    }
    return '';
  }
  return '';
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
