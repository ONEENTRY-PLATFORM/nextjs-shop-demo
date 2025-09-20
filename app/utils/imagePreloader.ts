/**
 * Image preloading utility for improved performance
 */

interface PreloadImageOptions {
  src: string;
  srcSet?: string;
  sizes?: string;
}

interface PreloadResult {
  success: boolean;
  error?: Error;
}

/**
 * Preload a single image
 * @param options Image preload options
 * @returns Promise resolving to preload result
 */
export const preloadImage = (
  options: PreloadImageOptions,
): Promise<PreloadResult> => {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      resolve({ success: true });
    };

    img.onerror = (error) => {
      resolve({ success: false, error: error as unknown as Error });
    };

    img.src = options.src;

    if (options.srcSet) {
      img.srcset = options.srcSet;
    }

    if (options.sizes) {
      img.sizes = options.sizes;
    }
  });
};

/**
 * Preload multiple images
 * @param images Array of image preload options
 * @returns Promise resolving to array of preload results
 */
export const preloadImages = async (
  images: PreloadImageOptions[],
): Promise<PreloadResult[]> => {
  const preloadPromises = images.map(preloadImage);
  return Promise.all(preloadPromises);
};

/**
 * Preload critical images for the current page
 * @param imageUrls Array of critical image URLs
 */
export const preloadCriticalImages = (imageUrls: string[]): void => {
  // Use requestIdleCallback if available for non-blocking preloading
  const preloadFn = (callback: () => void) => {
    if ('requestIdleCallback' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).requestIdleCallback(callback, { timeout: 2000 });
    } else {
      setTimeout(callback, 0);
    }
  };

  preloadFn(() => {
    imageUrls.forEach((url) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  });
};
