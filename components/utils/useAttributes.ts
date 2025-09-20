/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Safely extracts image URL from attribute values
 *
 * @param name The name of the attribute
 * @param attributeValues The attribute values
 *
 * @returns The image URL or undefined
 */
export const useImageUrl = (
  name: any,
  attributeValues: any,
): string | undefined => {
  if (
    attributeValues?.[name] &&
    typeof attributeValues[name] === 'object' &&
    'value' in attributeValues[name] &&
    Array.isArray(attributeValues[name].value) &&
    attributeValues[name].value.length > 0
  ) {
    const firstImage = attributeValues[name].value[0];
    if (
      firstImage &&
      typeof firstImage === 'object' &&
      'downloadLink' in firstImage &&
      typeof firstImage.downloadLink === 'string'
    ) {
      return firstImage.downloadLink;
    }
  }
  return '';
};

/**
 * Safely extracts String from attribute values
 *
 * @param name Attribute name
 * @param attributeValues The attribute values
 *
 * @returns String value or undefined
 */

export const useString = (
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
 * Safely extracts the list content from attribute values
 *
 * @param {string} name The name of the attribute
 * @param {any} attributeValues The attribute values object
 * @param {string} type of the content
 *
 * @returns HTML content
 */
export const useText = (
  name: string,
  attributeValues: any,
  type: 'html' | 'plain' = 'html',
): string => {
  if (
    attributeValues?.[name] &&
    typeof attributeValues[name] === 'object' &&
    'value' in attributeValues[name] &&
    Array.isArray(attributeValues[name].value) &&
    attributeValues.list.value.length > 0
  ) {
    const list = attributeValues[name].value[0];
    if (
      list &&
      typeof list === 'object' &&
      ('htmlValue' in list || 'plainValue' in list)
    ) {
      if (type === 'html') {
        return typeof list.htmlValue === 'string' ? list.htmlValue : '';
      }
      return typeof list.plainValue === 'string' ? list.plainValue : '';
    }
  }
  return '';
};
