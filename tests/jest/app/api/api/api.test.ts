/*
 * Unit tests for the `isError` type guard exported from `app/api/api/api.ts`.
 * The SDK instance itself is not exercised — only the pure guard.
 *
 * Ported from the nextjs-restaurant project and adapted: there the guard
 * discriminates on `typeof statusCode === 'number'` alone, while this
 * project's guard requires BOTH `statusCode` and `message` keys to be present
 * (see `.claude/rules/typescript.md` — canonical guard).
 */
import { describe, expect, it } from '@jest/globals';

import { isError } from '@/app/api/api/api';

describe('isError', () => {
  it('returns true when both statusCode and message are present (the SDK error shape)', () => {
    expect(isError({ statusCode: 404, message: 'Not found' })).toBe(true);
    expect(isError({ statusCode: 500, message: '' })).toBe(true);
    // Form-validator errors come back with message as string[] — these must be treated as errors.
    expect(
      isError({
        statusCode: 400,
        message: ['email is required', 'name is required'],
      }),
    ).toBe(true);
    // The guard checks key PRESENCE, not value types — a string statusCode still discriminates.
    expect(isError({ statusCode: '404', message: 'm' })).toBe(true);
  });

  it('returns false when statusCode or message is missing', () => {
    expect(isError({ statusCode: 404 })).toBe(false); // no message
    expect(isError({ message: 'm' })).toBe(false); // no statusCode
  });

  it('returns false for null / undefined / primitives', () => {
    expect(isError(null)).toBe(false);
    expect(isError(undefined)).toBe(false);
    expect(isError('error')).toBe(false);
    expect(isError(404)).toBe(false);
    expect(isError(false)).toBe(false);
  });

  it('returns false for non-error objects (plain entities)', () => {
    expect(isError({ id: 1, title: 'T-shirt' })).toBe(false);
  });
});
