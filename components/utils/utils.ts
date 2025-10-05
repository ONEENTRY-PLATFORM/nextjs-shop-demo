import type { IError } from 'oneentry/dist/base/utils';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';

import { CurrencyEnum, IntlEnum } from '@/app/types/enum';

/**
 * Formats a numeric amount as a currency string based on the specified language.
 *
 * This function takes a numeric amount and formats it as a localized currency
 * string using Intl.NumberFormat. It determines the appropriate currency and
 * locale settings based on the provided language code.
 * @param   {object}          options        - Configuration options.
 * @param   {number | string} options.amount - The numeric amount to format.
 * @param   {string}          options.lang   - The language code to determine currency and formatting.
 * @returns {string}                         Formatted currency string (e.g., "$123.45", "€123,45").
 * @example
 * ```typescript
 * const price = UsePrice({ amount: 123.45, lang: 'en' });
 * // Returns "$123.45"
 * ```
 */
export const UsePrice = ({
  amount,
  lang,
}: {
  amount: number | string;
  lang: string;
}): string => {
  const currency = CurrencyEnum[lang as keyof typeof CurrencyEnum];
  const intlEnum = IntlEnum[lang as keyof typeof IntlEnum];
  const formattedPrice = new Intl.NumberFormat(intlEnum, {
    style: 'currency',
    currency: currency,
  }).format(Number(amount));

  return formattedPrice;
};

/**
 * Formats a date into a localized string representation.
 *
 * This function takes a date and formats it as a localized string with
 * day, month, and year components. The format varies based on the locale.
 * @param   {object}                 options          - Configuration options.
 * @param   {number | string | Date} options.fullDate - The date to format (as Date, string, or timestamp).
 * @param   {string}                 options.format   - The locale identifier for formatting (default: 'en').
 * @returns {string}                                  Formatted date string (e.g., "01-Jan-2023").
 * @example
 * ```typescript
 * const date = UseDate({ fullDate: new Date(), format: 'en' });
 * // Returns "01-Jan-2023"
 * ```
 */
export const UseDate = ({
  fullDate,
  format = 'en',
}: {
  fullDate: number | string | Date;
  format: string;
}): string => {
  const d = new Date(fullDate);
  const year = new Intl.DateTimeFormat(format, {
    year: 'numeric',
  }).format(d);
  const month = new Intl.DateTimeFormat(format, {
    month: 'short',
  }).format(d);
  const day = new Intl.DateTimeFormat(format, {
    day: '2-digit',
  }).format(d);

  const date = day + '-' + month + '-' + year;

  return date;
};

/**
 * Sorts object fields by their position property.
 *
 * This function takes an object and sorts its entries based on the
 * position property of each value. The result is a new object with
 * the same keys but ordered by position.
 * @param   {Record<string, { position: number }>} obj - The object to sort.
 * @returns {Record<string, { position: number }>}     A new object with entries sorted by position.
 * @example
 * ```typescript
 * const sorted = sortObjectFieldsByPosition({
 *   a: { position: 2 },
 *   b: { position: 1 }
 * });
 * // Returns { b: { position: 1 }, a: { position: 2 } }
 * ```
 */

export const sortObjectFieldsByPosition = (
  obj: Record<string, { position: number }>,
): Record<string, { position: number }> => {
  const entries = Object.entries(obj);
  entries.sort((a, b) => a[1].position - b[1].position);
  const sortedObj = {};
  for (const [key, value] of entries) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    sortedObj[key] = value;
  }
  return sortedObj;
};

/**
 * Converts a flat menu array into a nested structure.
 *
 * This function takes a flat array of menu items and converts it into
 * a hierarchical tree structure based on parent-child relationships.
 * @param   {[] | Array<IMenusPages>} data - Array of menu items.
 * @param   {number | null}           pid  - Parent ID to start from (null for root level).
 * @returns {IMenusPages[]}                Nested array of menu items with children.
 * @example
 * ```typescript
 * const nested = flatMenuToNested([
 *   { id: 1, parentId: null },
 *   { id: 2, parentId: 1 }
 * ], null);
 * // Returns [{ id: 1, parentId: null, children: [{ id: 2, parentId: 1 }] }]
 * ```
 */
export const flatMenuToNested = (
  data: [] | Array<IMenusPages>,
  pid: number | null,
): IMenusPages[] => {
  return data.reduce((r: IMenusPages[], element: IMenusPages) => {
    if (pid == element.parentId) {
      const object = { ...element };
      const children = flatMenuToNested(data, element.id);
      if (children.length) {
        object.children = children;
      }
      r.push(object);
    }
    return r;
  }, []);
};

/**
 * Type guard to check if a value is an IError object.
 *
 * This function checks if the provided value has the properties of an
 * IError object, specifically checking for the presence of a statusCode.
 * @param   {IError | unknown} res - The value to check.
 * @returns {IError}               True if the value is an IError object, false otherwise.
 * @example
 * ```typescript
 * if (typeError(result)) {
 *   console.log('Error occurred:', result.statusCode);
 * }
 * ```
 */
export function typeError(res: IError | unknown): res is IError {
  if ((res as IError)?.statusCode) {
    return true;
  }
  return false;
}
