/**
 * API response types for strict typing
 */

/**
 * Error response type.
 * @param {number} statusCode - HTTP status code.
 * @param {string} message    - Error message.
 * @param {string} [error]    - Optional error object.
 */
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

/**
 * API response type.
 * Used for consistent API responses.
 * @template            T         - Type of data returned by the API.
 * @param    {T}        [data]    - Data returned by the API.
 * @param    {ApiError} [error]   - Error object.
 * @param    {boolean}  [isError] - Indicates whether the response is an error.
 */
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  isError: boolean;
}

/**
 * Paginated response type.
 * Used for paginated API responses.
 * @template          T     - Type of data returned by the API.
 * @param    {T[]}    items - Array of items returned by the API.
 * @param    {number} total - Total number of items.
 * @param    {number} page  - Current page number.
 * @param    {number} limit - Number of items per page.
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Hook result type.
 * Used for consistent hook results.
 * @template                   T         - Type of data returned by the hook.
 * @param    {T | null}        data      - Data returned by the hook.
 * @param    {boolean}         isLoading - Indicates whether the hook is loading data.
 * @param    {ApiError | null} error     - Error object.
 * @param    {void}            refetch   - Function to refetch data.
 */
export interface ApiHookResult<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => void;
}
