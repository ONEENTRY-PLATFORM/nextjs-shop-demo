import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { toast } from 'react-toastify';

import {
  ApiError,
  formatErrorMessage,
  handleApiError,
  isIError,
  useApiErrorHandler,
} from '@/app/utils/errorHandler';

describe('isIError', () => {
  it('returns true for objects with `statusCode` and `message`', () => {
    expect(isIError({ statusCode: 404, message: 'Not found' })).toBe(true);
  });

  it('returns false when only one of the fields is present', () => {
    expect(isIError({ statusCode: 404 })).toBe(false);
    expect(isIError({ message: 'm' })).toBe(false);
  });

  it('returns false for null / undefined / primitives', () => {
    expect(isIError(null)).toBe(false);
    expect(isIError(undefined)).toBe(false);
    expect(isIError('error')).toBe(false);
    expect(isIError(404)).toBe(false);
  });

  it('returns false for a plain Error instance (no `statusCode`)', () => {
    expect(isIError(new Error('boom'))).toBe(false);
  });
});

describe('ApiError', () => {
  it('captures message / statusCode / originalError', () => {
    const original = { foo: 'bar' };
    const err = new ApiError('boom', 418, original);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('ApiError');
    expect(err.message).toBe('boom');
    expect(err.statusCode).toBe(418);
    expect(err.originalError).toBe(original);
  });

  it('originalError is optional', () => {
    const err = new ApiError('x', 500);
    expect(err.originalError).toBeUndefined();
  });
});

describe('handleApiError', () => {
  // Silence the diagnostic `console.log` the handler emits — keeps test output clean.
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('maps an IError-shaped value to ApiError with the same statusCode/message', () => {
    const result = handleApiError('h', {
      statusCode: 404,
      message: 'Not found',
    });
    expect(result).toBeInstanceOf(ApiError);
    expect(result.statusCode).toBe(404);
    expect(result.message).toBe('Not found');
  });

  it('defaults statusCode to 500 when IError has no statusCode', () => {
    // The implementation falls back to 500 when `statusCode` is falsy (0 / undefined).
    const result = handleApiError('h', { statusCode: 0, message: 'm' });
    expect(result.statusCode).toBe(500);
  });

  it('defaults message when IError.message is empty', () => {
    const result = handleApiError('h', { statusCode: 503, message: '' });
    expect(result.message).toBe('An error occurred');
  });

  it('maps a plain Error to ApiError (statusCode 500)', () => {
    const result = handleApiError('h', new Error('whoops'));
    expect(result).toBeInstanceOf(ApiError);
    expect(result.statusCode).toBe(500);
    expect(result.message).toBe('whoops');
  });

  it('maps an unknown value (string / number / null) to an ApiError with a generic message', () => {
    const a = handleApiError('h', 'just a string');
    expect(a.statusCode).toBe(500);
    expect(a.message).toBe('An unknown error occurred');

    const b = handleApiError('h', null);
    expect(b.message).toBe('An unknown error occurred');
  });

  it('preserves the original error on the ApiError instance', () => {
    const original = { statusCode: 401, message: 'no' };
    const result = handleApiError('h', original);
    expect(result.originalError).toBe(original);
  });
});

describe('formatErrorMessage', () => {
  it.each([
    [400, 'Bad Request: Please check your input'],
    [401, 'Unauthorized: Please log in'],
    [403, 'Forbidden: You do not have permission'],
    [404, 'Not Found: The requested resource was not found'],
    [500, 'Internal Server Error: Please try again later'],
  ])('maps statusCode %i → "%s"', (statusCode, expected) => {
    expect(formatErrorMessage({ statusCode, message: 'ignored' })).toBe(
      expected,
    );
  });

  it('falls back to IError.message for an unmapped status code', () => {
    expect(
      formatErrorMessage({ statusCode: 418, message: 'I am a teapot' }),
    ).toBe('I am a teapot');
  });

  it('falls back to defaultMessage when IError.message is empty and status is unmapped', () => {
    expect(
      formatErrorMessage({ statusCode: 418, message: '' }, 'fallback'),
    ).toBe('fallback');
  });

  it('returns the message of a plain Error', () => {
    expect(formatErrorMessage(new Error('nope'))).toBe('nope');
  });

  it('returns defaultMessage for unknown / null inputs', () => {
    expect(formatErrorMessage(null)).toBe('An error occurred');
    expect(formatErrorMessage('string', 'custom')).toBe('custom');
  });
});

describe('useApiErrorHandler', () => {
  let toastSpy: jest.SpiedFunction<typeof toast.error>;

  beforeEach(() => {
    // `jest.spyOn` on the real module's method is more robust than `jest.mock`
    // factory replacement under next/swc transform.
    toastSpy = jest
      .spyOn(toast, 'error')
      .mockImplementation(() => 'toast-id' as never);
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns a function that surfaces the error message via toast and returns an ApiError', () => {
    const handler = useApiErrorHandler() as (error: unknown) => ApiError;
    const result = handler({ statusCode: 404, message: 'Not found' });

    expect(result).toBeInstanceOf(ApiError);
    expect(result.statusCode).toBe(404);
    expect(toastSpy).toHaveBeenCalledTimes(1);
    expect(toastSpy).toHaveBeenCalledWith('Not found');
  });

  it('toasts the generic message for an unknown error', () => {
    const handler = useApiErrorHandler() as (error: unknown) => ApiError;
    handler('weird');
    expect(toastSpy).toHaveBeenCalledWith('An unknown error occurred');
  });
});
