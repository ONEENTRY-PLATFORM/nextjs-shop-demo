/**
 * API response types for strict typing
 */

// Error response type
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  isError: boolean;
}

// Generic paginated response
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// Generic hook return type
export interface ApiHookResult<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => void;
}
