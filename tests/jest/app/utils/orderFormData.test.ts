import { describe, expect, it } from '@jest/globals';

import { buildTimeIntervalValue } from '@/app/utils/orderFormData';

/*
 * Unit tests for buildTimeIntervalValue — guards the `shipping_interval`
 * (timeInterval) payload shape the Orders API requires. Sending the wrong shape
 * makes createOrder fail with
 * `400 formData's marker 'shipping_interval' value must be an array`.
 */
describe('buildTimeIntervalValue', () => {
  it('wraps a [start, end] Date pair into a single [[startISO, endISO]] tuple', () => {
    const start = new Date('2026-07-30T15:00:00.000Z');
    const end = new Date('2026-07-30T16:00:00.000Z');

    const result = buildTimeIntervalValue([start, end]);

    expect(result).toEqual([
      ['2026-07-30T15:00:00.000Z', '2026-07-30T16:00:00.000Z'],
    ]);
  });

  it('produces an array whose single element is itself an array (the API contract)', () => {
    const result = buildTimeIntervalValue([
      new Date('2026-01-01T00:00:00.000Z'),
      new Date('2026-01-01T01:00:00.000Z'),
    ]);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(Array.isArray(result[0])).toBe(true);
    expect(result[0]).toHaveLength(2);
  });

  it('returns an empty array when the interval is undefined', () => {
    expect(buildTimeIntervalValue(undefined)).toEqual([]);
  });

  it('returns an empty array when the interval is empty', () => {
    expect(buildTimeIntervalValue([])).toEqual([]);
  });

  it('returns an empty array when the interval does not hold exactly two dates', () => {
    expect(
      buildTimeIntervalValue([new Date('2026-07-30T15:00:00.000Z')]),
    ).toEqual([]);
    expect(
      buildTimeIntervalValue([
        new Date('2026-07-30T15:00:00.000Z'),
        new Date('2026-07-30T16:00:00.000Z'),
        new Date('2026-07-30T17:00:00.000Z'),
      ]),
    ).toEqual([]);
  });
});
