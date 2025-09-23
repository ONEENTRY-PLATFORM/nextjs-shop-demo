import type { IError } from 'oneentry/dist/base/utils';

/**
 * Custom error class for API errors
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
 * Type guard to check if an object is of type IError
 * @param error The error object to check
 * @returns True if the object is an IError, false otherwise
 */
export function isIError(error: unknown): error is IError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    'message' in error
  );
}

/**
 * Centralized error handling function
 * @param error The error to handle
 * @returns An ApiError with standardized format
 */
export function handleApiError(error: unknown): ApiError {
  if (isIError(error)) {
    return new ApiError(
      error.message || 'An error occurred',
      error.statusCode || 500,
      error,
    );
  }

  if (error instanceof Error) {
    return new ApiError(error.message || 'An error occurred', 500, error);
  }

  return new ApiError('An unknown error occurred', 500, error);
}

/**
 * Custom hook for handling API errors in React components
 * @returns A function to handle API errors with toast notifications
 */
export function useApiErrorHandler() {
  // This would typically integrate with a notification system like toast
  return function handleApiErrorWithNotification(error: unknown): ApiError {
    const apiError = handleApiError(error);

    // In a real implementation, you might show a toast notification here
    // toast.error(apiError.message);

    return apiError;
  };
}
