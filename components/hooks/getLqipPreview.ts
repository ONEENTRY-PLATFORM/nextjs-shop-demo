import lqipModern from 'lqip-modern';

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
const getLqipPreview = async (imageUrl: string) => {
  const image = await fetch(imageUrl);
  const imageBuffer = Buffer.from(await image.arrayBuffer());
  const previewImage = await lqipModern(imageBuffer);

  return previewImage.metadata.dataURIBase64;
};

export default getLqipPreview;