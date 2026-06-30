/**
 * Helpers that shape order `formData` values into the structures the OneEntry
 * Orders API expects. Kept as pure functions so the (otherwise UI-bound)
 * transformations can be unit-tested in isolation.
 */

/**
 * Builds the value for the `shipping_interval` (`timeInterval`) order attribute.
 *
 * The Orders API expects a `timeInterval` value as an array of `[start, end]`
 * ISO-string tuples (`[[startISO, endISO], ...]`). Passing an array of date
 * objects (the previous behaviour) makes `createOrder` reject the whole order
 * with `400 formData's marker 'shipping_interval' value must be an array`.
 * @param   {Date[]}     [interval] - Delivery interval as a `[start, end]` `Date` pair.
 * @returns {string[][]}            `[[startISO, endISO]]`, or `[]` when there is no valid pair.
 */
export const buildTimeIntervalValue = (interval?: Date[]): string[][] => {
  if (!interval || interval.length !== 2) {
    return [];
  }
  return [interval.map((date) => new Date(date).toISOString())];
};
