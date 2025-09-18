import { useCallback, useState } from 'react';

import type { ApiError } from '@/app/utils/errorHandler';
import { handleApiError } from '@/app/utils/errorHandler';

/**
 * Custom hook for making API calls with centralized error handling
 * @template T The type of data returned by the API call
 * @param apiCall The API call function to execute
 * @returns An object containing the data, loading state, error, and execute function
 */
export function useApiCall<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  /**
   * Execute the API call with centralized error handling
   * @param apiCall The API call function to execute
   * @param onSuccess Optional callback to execute on successful API call
   */
  const execute = useCallback(
    async (apiCall: () => Promise<T>, onSuccess?: (data: T) => void) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        setData(result);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { data, loading, error, execute, setData, setError };
}
