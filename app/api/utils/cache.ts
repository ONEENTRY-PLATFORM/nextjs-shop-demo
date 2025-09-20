/**
 * Simple in-memory cache utility
 *
 * This utility provides a generic caching mechanism for API responses
 * to reduce the number of external API calls and improve performance.
 */

// Cache storage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new Map<string, { data: any; timestamp: number }>();

// Default cache duration (5 minutes)
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000;

/**
 * Get cached data if it exists and is still valid
 *
 * @param key - Cache key
 * @param cacheDuration - Cache duration in milliseconds
 * @returns Cached data or null if not found or expired
 */
export function getCachedData<T>(
  key: string,
  cacheDuration: number = DEFAULT_CACHE_DURATION,
): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cacheDuration) {
    return cached.data as T;
  }
  return null;
}

/**
 * Set data in cache
 *
 * @param key - Cache key
 * @param data - Data to cache
 */
export function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Clear expired cache entries
 *
 * @param cacheDuration - Cache duration in milliseconds
 */
export function clearExpiredCache(
  cacheDuration: number = DEFAULT_CACHE_DURATION,
): void {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp >= cacheDuration) {
      cache.delete(key);
    }
  }
}

/**
 * Clear all cache
 */
export function clearAllCache(): void {
  cache.clear();
}
