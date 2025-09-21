import lqipModern from 'lqip-modern';

// This file has been moved to app/api/utils/getLqipPreview.ts because it uses the lqip-modern package
// which depends on sharp, a Node.js library that uses built-in modules like child_process and fs
// that are not available in the browser environment.
//
// If you need to use this functionality in client-side code, you should either:
// 1. Create an API endpoint that uses this server-side function
// 2. Use a browser-compatible alternative

// Simple in-memory cache for LQIP previews
const lqipCache = new Map<string, { dataURI: string; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Asynchronously generates a low-quality image placeholder (LQIP) from an image URL
 *
 * This function fetches an image from the provided URL and generates a low-quality
 * base64-encoded preview image that can be used as a placeholder while the full
 * quality image is loading. This improves perceived performance and user experience.
 *
 * @param imageUrl - The URL of the image to generate a placeholder for
 * @returns A promise that resolves to a base64-encoded data URI of the low-quality placeholder
 *
 * @example
 * ```typescript
 * const preview = await getLqipPreview('https://example.com/image.jpg');
 * // Returns a base64 data URI like "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/..."
 * ```
 */
const getLqipPreview = async (imageUrl: string): Promise<string> => {
  // Check cache first
  const cached = lqipCache.get(imageUrl);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.dataURI;
  }

  try {
    const image = await fetch(imageUrl);
    if (!image.ok) {
      throw new Error(
        `Failed to fetch image: ${image.status} ${image.statusText}`,
      );
    }

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const previewImage = await lqipModern(imageBuffer);
    const dataURI = previewImage.metadata.dataURIBase64;

    // Cache the result
    lqipCache.set(imageUrl, { dataURI, timestamp: Date.now() });

    return dataURI;
  } catch (error) {
    // Return a default placeholder if LQIP generation fails
    // eslint-disable-next-line no-console
    console.warn(`Failed to generate LQIP for ${imageUrl}:`, error);
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4=';
  }
};

export default getLqipPreview;
