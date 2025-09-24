/* eslint-disable no-console */
/**
 * Simple in-memory cache utility
 *
 * This utility provides a generic caching mechanism for API responses
 * to reduce the number of external API calls and improve performance.
 */

// Default cache duration (5 minutes)
// const DEFAULT_CACHE_DURATION = 5 * 60 * 1000;

// Generic cache functions with strict typing
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

// Generic function to get cached data
export function getCachedData<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const parsed: CacheItem<T> = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is expired
    if (now - parsed.timestamp > parsed.ttl) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch (e) {
    console.error('Error getting cached data:', e);
    return null;
  }
}

// Generic function to set cached data
export function setCachedData<T>(
  key: string,
  data: T,
  ttl: number = 5 * 60 * 1000,
): void {
  if (typeof window === 'undefined') return;

  try {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    localStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (e) {
    console.error('Error setting cached data:', e);
  }
}

// Generic function to clear cached data
export function clearCachedData(key: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Error clearing cached data:', e);
  }
}

// Function to clear all cache data
export function clearAllCache(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.clear();
  } catch (e) {
    console.error('Error clearing all cached data:', e);
  }
}
