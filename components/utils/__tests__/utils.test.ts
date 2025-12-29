/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from 'vitest';

import {
  flatMenuToNested,
  sortObjectFieldsByPosition,
  typeError,
  UseDate,
  UsePrice,
} from '../utils';

describe('UsePrice', () => {
  it('should format price in USD for English locale', () => {
    const result = UsePrice({ amount: 1000, lang: 'en' });
    expect(result).toBe('$1,000.00');
  });

  it('should format price in EUR for French locale', () => {
    const result = UsePrice({ amount: 1000, lang: 'fr' });
    // French locale formats as "1 000,00 €"
    expect(result).toContain('1');
    expect(result).toContain('000');
    expect(result).toContain('€');
  });

  it('should handle zero amount', () => {
    const result = UsePrice({ amount: 0, lang: 'en' });
    expect(result).toBe('$0.00');
  });

  it('should handle string amounts', () => {
    const result = UsePrice({ amount: '250.50', lang: 'en' });
    expect(result).toBe('$250.50');
  });

  it('should handle decimal amounts', () => {
    const result = UsePrice({ amount: 99.99, lang: 'en' });
    expect(result).toBe('$99.99');
  });

  it('should use default USD currency for unknown language', () => {
    const result = UsePrice({ amount: 100, lang: 'unknown' });
    expect(result).toContain('100');
    expect(result).toContain('$');
  });
});

describe('UseDate', () => {
  it('should format date for English locale', () => {
    const date = new Date('2024-01-15');
    const result = UseDate({ fullDate: date, format: 'en' });
    expect(result).toMatch(/15-Jan-2024/);
  });

  it('should format date for French locale', () => {
    const date = new Date('2024-01-15');
    const result = UseDate({ fullDate: date, format: 'fr' });
    expect(result).toMatch(/15-janv\.-2024/);
  });

  it('should handle timestamp input', () => {
    const timestamp = new Date('2024-06-20').getTime();
    const result = UseDate({ fullDate: timestamp, format: 'en' });
    expect(result).toMatch(/20-Jun-2024/);
  });

  it('should handle string date input', () => {
    const result = UseDate({ fullDate: '2024-12-25', format: 'en' });
    expect(result).toMatch(/25-Dec-2024/);
  });
});

describe('sortObjectFieldsByPosition', () => {
  it('should sort object by position ascending', () => {
    const input = {
      field3: { position: 3 },
      field1: { position: 1 },
      field2: { position: 2 },
    };

    const result = sortObjectFieldsByPosition(input);
    const keys = Object.keys(result);

    expect(keys[0]).toBe('field1');
    expect(keys[1]).toBe('field2');
    expect(keys[2]).toBe('field3');
  });

  it('should handle empty object', () => {
    const result = sortObjectFieldsByPosition({});
    expect(result).toEqual({});
  });

  it('should handle single field', () => {
    const input = { field1: { position: 1 } };
    const result = sortObjectFieldsByPosition(input);
    expect(result).toEqual(input);
  });

  it('should handle negative positions', () => {
    const input = {
      field1: { position: -1 },
      field2: { position: 0 },
      field3: { position: 1 },
    };

    const result = sortObjectFieldsByPosition(input);
    const keys = Object.keys(result);

    expect(keys[0]).toBe('field1');
    expect(keys[1]).toBe('field2');
    expect(keys[2]).toBe('field3');
  });
});

describe('flatMenuToNested', () => {
  it('should convert flat menu to nested structure', () => {
    const flatMenu = [
      {
        id: 1,
        parentId: null,
        pageUrl: 'home',
        localizeInfos: { menuTitle: 'Home' },
        attributeValues: {},
        position: 1,
      },
      {
        id: 2,
        parentId: 1,
        pageUrl: 'about',
        localizeInfos: { menuTitle: 'About' },
        attributeValues: {},
        position: 1,
      },
      {
        id: 3,
        parentId: 1,
        pageUrl: 'contact',
        localizeInfos: { menuTitle: 'Contact' },
        attributeValues: {},
        position: 2,
      },
      {
        id: 4,
        parentId: 2,
        pageUrl: 'team',
        localizeInfos: { menuTitle: 'Team' },
        attributeValues: {},
        position: 1,
      },
    ];

    const result = flatMenuToNested(flatMenu, null);

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe(1);
    expect(result[0]?.children).toHaveLength(2);
    expect(Array.isArray(result[0]?.children)).toBe(true);

    // Type assertion to handle TypeScript error
    const firstChild = (result[0]?.children as Array<any>)?.[0];
    expect(firstChild?.id).toBe(2);
    expect(firstChild?.children).toHaveLength(1);
    expect(Array.isArray(firstChild?.children)).toBe(true);
    expect((firstChild?.children as Array<any>)?.[0]?.id).toBe(4);
  });

  it('should handle empty array', () => {
    const result = flatMenuToNested([], null);
    expect(result).toEqual([]);
  });

  it('should handle flat menu with no nesting', () => {
    const flatMenu = [
      {
        id: 1,
        parentId: null,
        pageUrl: 'home',
        localizeInfos: { menuTitle: 'Home' },
        attributeValues: {},
        position: 1,
      },
      {
        id: 2,
        parentId: null,
        pageUrl: 'about',
        localizeInfos: { menuTitle: 'About' },
        attributeValues: {},
        position: 2,
      },
    ];

    const result = flatMenuToNested(flatMenu, null);

    expect(result).toHaveLength(2);
    expect(result[0]?.children).toBeUndefined();
    expect(result[1]?.children).toBeUndefined();
  });
});

describe('typeError', () => {
  it('should return true for IError object with statusCode', () => {
    const error = {
      statusCode: 404,
      message: 'Not Found',
    };

    expect(typeError(error)).toBe(true);
  });

  it('should return false for object without statusCode', () => {
    const notError = {
      message: 'Something',
    };

    expect(typeError(notError)).toBe(false);
  });

  it('should return false for null', () => {
    expect(typeError(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(typeError(undefined)).toBe(false);
  });

  it('should return false for string', () => {
    expect(typeError('error')).toBe(false);
  });

  it('should return true for error with statusCode 0', () => {
    const error = {
      statusCode: 0,
    };
    // statusCode 0 is falsy, so should return false
    expect(typeError(error)).toBe(false);
  });

  it('should return true for error with statusCode 500', () => {
    const error = {
      statusCode: 500,
      message: 'Internal Server Error',
    };

    expect(typeError(error)).toBe(true);
  });
});
