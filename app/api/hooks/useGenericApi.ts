import type { IError } from 'oneentry/dist/base/utils';
import { useCallback, useEffect, useState } from 'react';

import type { UseApiHook } from '@/app/types/hooks';

/**
 * Generic hook for API calls with strict typing
 *
 * @template T - The type of data returned by the API
 * @template P - The type of parameters for the API call
 * @param apiFunction - The API function to call
 * @param defaultParams - Default parameters for the API call
 *
 * @returns An object with data, loading state, error, and refetch function
 */
export function useGenericApi<T, P = void>(
  apiFunction: (params: P) => Promise<T | IError>,
  defaultParams?: P,
): UseApiHook<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);

  const fetchData = useCallback(
    async (params: P = defaultParams as P) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiFunction(params);

        if ((result as IError)?.statusCode) {
          setError(result as IError);
          setData(null);
        } else {
          setData(result as T);
        }
      } catch (err) {
        setError({
          statusCode: 500,
          message:
            err instanceof Error ? err.message : 'Unknown error occurred',
        } as IError);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction, defaultParams],
  );

  useEffect(() => {
    if (defaultParams !== undefined) {
      fetchData(defaultParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetch = useCallback(
    (params?: P) => {
      fetchData(params || (defaultParams as P));
    },
    [fetchData, defaultParams],
  );

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Generic hook for API calls without initial loading
 *
 * @template T - The type of data returned by the API
 * @template P - The type of parameters for the API call
 * @param apiFunction - The API function to call
 *
 * @returns An object with data, loading state, error, and execute function
 */
export function useLazyGenericApi<T, P = void>(
  apiFunction: (params: P) => Promise<T | IError>,
): [UseApiHook<T>, (params: P) => Promise<void>] {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);

  const execute = useCallback(
    async (params: P) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiFunction(params);

        if ((result as IError)?.statusCode) {
          setError(result as IError);
          setData(null);
        } else {
          setData(result as T);
        }
      } catch (err) {
        setError({
          statusCode: 500,
          message:
            err instanceof Error ? err.message : 'Unknown error occurred',
        } as IError);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction],
  );

  return [
    {
      data,
      isLoading,
      error,
      refetch: () => {}, // Empty refetch for lazy loading
    },
    execute,
  ];
}
