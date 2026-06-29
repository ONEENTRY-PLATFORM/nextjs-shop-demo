/* eslint-disable no-console */
import { toast } from 'react-toastify';

import { isError } from '@/app/api/api/api';

/**
 * Custom error class for API errors
 * @property {number}  statusCode    - The HTTP status code of the error
 * @property {unknown} originalError - The original error object
 */
export class ApiError extends Error {
  statusCode: number;
  originalError?: unknown;

  constructor(message: string, statusCode: number, originalError?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

/**
 * Type guard alias kept for backward compatibility with existing call sites.
 * Prefer importing {@link isError} from `@/app/api` in new code.
 * @deprecated Use `isError` from `@/app/api` instead.
 */
export const isIError = isError;

/**
 * Centralized error handling function
 * @param   {string}   handle - The function to handle the error
 * @param   {unknown}  error  - The error to handle
 * @returns {ApiError}        An ApiError with standardized format
 */
export function handleApiError(handle: string, error: unknown): ApiError {
  if (isError(error)) {
    /** Log the error for debugging purposes */
    console.log('API Error:', {
      handle: handle,
      message: error.message,
      statusCode: error.statusCode,
      timestamp: new Date().toISOString(),
    });

    return new ApiError(
      error.message || 'An error occurred',
      error.statusCode || 500,
      error,
    );
  }

  if (error instanceof Error) {
    /** Log the error for debugging purposes */
    console.log('Generic Error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    return new ApiError(error.message || 'An error occurred', 500, error);
  }

  /** Log unknown errors */
  console.log('Unknown Error:', {
    error,
    timestamp: new Date().toISOString(),
  });

  return new ApiError('An unknown error occurred', 500, error);
}

/**
 * Custom hook for handling API errors in React components
 * @returns {unknown} A function to handle API errors with toast notifications
 */
export function useApiErrorHandler(): unknown {
  /* This would typically integrate with a notification system like toast */
  return function handleApiErrorWithNotification(error: unknown): ApiError {
    const apiError = handleApiError('useApiErrorHandler', error);
    toast.error(apiError.message);

    return apiError;
  };
}

/**
 * Format error message for user display.
 * @param   {unknown} error          - The error to format
 * @param   {string}  defaultMessage - Default message to show if error is not recognized
 * @returns {string}                 Formatted error message
 */
export function formatErrorMessage(
  error: unknown,
  defaultMessage: string = 'An error occurred',
): string {
  if (isError(error)) {
    switch (error.statusCode) {
      case 400:
        return 'Bad Request: Please check your input';
      case 401:
        return 'Unauthorized: Please log in';
      case 403:
        return 'Forbidden: You do not have permission';
      case 404:
        return 'Not Found: The requested resource was not found';
      case 500:
        return 'Internal Server Error: Please try again later';
      default:
        return error.message || defaultMessage;
    }
  }

  if (error instanceof Error) {
    return error.message || defaultMessage;
  }

  return defaultMessage;
}
