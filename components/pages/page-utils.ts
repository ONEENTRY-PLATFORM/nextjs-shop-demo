import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

/**
 * Safely extracts the page title from attribute values
 * @param page The page entity
 * @param fallback The fallback string if title is not found
 * @returns The page title or a fallback string
 */
export const getPageTitle = (page: IPagesEntity, fallback = ''): string => {
  if (
    page?.attributeValues?.title &&
    typeof page.attributeValues.title === 'object' &&
    'value' in page.attributeValues.title &&
    typeof page.attributeValues.title.value === 'string'
  ) {
    return page.attributeValues.title.value;
  }
  return fallback;
};

/**
 * Safely extracts the page image URL from attribute values
 * @param page The page entity
 * @returns The image URL or undefined
 */
export const getPageImageUrl = (page: IPagesEntity): string | undefined => {
  if (
    page?.attributeValues?.img &&
    typeof page.attributeValues.img === 'object' &&
    'value' in page.attributeValues.img &&
    Array.isArray(page.attributeValues.img.value) &&
    page.attributeValues.img.value.length > 0
  ) {
    const firstImage = page.attributeValues.img.value[0];
    if (
      firstImage &&
      typeof firstImage === 'object' &&
      'downloadLink' in firstImage &&
      typeof firstImage.downloadLink === 'string'
    ) {
      return firstImage.downloadLink;
    }
  }
  return undefined;
};

/**
 * Safely extracts the page content from attribute values
 * @param page The page entity
 * @returns The content object or undefined
 */
export const getPageContent = (
  page: IPagesEntity,
): { htmlValue?: string; plainValue?: string } | undefined => {
  if (
    page?.attributeValues?.content &&
    typeof page.attributeValues.content === 'object' &&
    'value' in page.attributeValues.content &&
    Array.isArray(page.attributeValues.content.value) &&
    page.attributeValues.content.value.length > 0
  ) {
    const content = page.attributeValues.content.value[0];
    if (
      content &&
      typeof content === 'object' &&
      ('htmlValue' in content || 'plainValue' in content)
    ) {
      return {
        htmlValue:
          typeof content.htmlValue === 'string' ? content.htmlValue : undefined,
        plainValue:
          typeof content.plainValue === 'string'
            ? content.plainValue
            : undefined,
      };
    }
  }
  return undefined;
};

/**
 * Safely extracts the list title from attribute values
 * @param page The page entity
 * @returns The list title or undefined
 */
export const getListTitle = (page: IPagesEntity): string | undefined => {
  if (
    page?.attributeValues?.list_title &&
    typeof page.attributeValues.list_title === 'object' &&
    'value' in page.attributeValues.list_title &&
    typeof page.attributeValues.list_title.value === 'string'
  ) {
    return page.attributeValues.list_title.value;
  }
  return undefined;
};

/**
 * Safely extracts the list content from attribute values
 * @param page The page entity
 * @returns The list content object or undefined
 */
export const getListContent = (
  page: IPagesEntity,
): { htmlValue?: string; plainValue?: string } | undefined => {
  if (
    page?.attributeValues?.list &&
    typeof page.attributeValues.list === 'object' &&
    'value' in page.attributeValues.list &&
    Array.isArray(page.attributeValues.list.value) &&
    page.attributeValues.list.value.length > 0
  ) {
    const list = page.attributeValues.list.value[0];
    if (
      list &&
      typeof list === 'object' &&
      ('htmlValue' in list || 'plainValue' in list)
    ) {
      return {
        htmlValue:
          typeof list.htmlValue === 'string' ? list.htmlValue : undefined,
        plainValue:
          typeof list.plainValue === 'string' ? list.plainValue : undefined,
      };
    }
  }
  return undefined;
};
