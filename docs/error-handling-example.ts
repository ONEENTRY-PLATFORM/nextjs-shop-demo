/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Example of how to properly handle errors in API service functions
 * using the centralized error handling system.
 */

import type { IError } from 'oneentry/dist/base/utils';
import { useState } from 'react';

import { handleApiError, isIError } from '@/app/utils/errorHandler';

// Example service function with proper error handling
export async function exampleApiCall(params: any): Promise<{
  isError: boolean;
  error?: IError;
  data?: any;
}> {
  try {
    // Make the API call
    const response = await fetch('/api/example', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    // Parse the response
    const data = await response.json();

    // Check if the response is an error from OneEntry
    if (isIError(data)) {
      return {
        isError: true,
        error: data,
      };
    }

    // Check for HTTP errors
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Return successful response
    return {
      isError: false,
      data,
    };
  } catch (error) {
    // Handle all other errors with our centralized handler
    const apiError = handleApiError(error);
    return {
      isError: true,
      error: {
        statusCode: apiError.statusCode,
        message: apiError.message,
      } as IError,
    };
  }
}

// Example usage in a React component
export function useExampleApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(null);

  const callApi = async (params: any) => {
    setLoading(true);
    setError(null);

    const result = await exampleApiCall(params);

    if (result.isError) {
      setError(result.error?.message || 'An unknown error occurred');
    } else {
      setData(result.data);
    }

    setLoading(false);
  };

  return { loading, error, data, callApi };
}
