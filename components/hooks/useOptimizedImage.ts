'use client';

import { useEffect, useState } from 'react';

/**
 * Interface for optimized image data and loading states.
 *
 * @property optimizedSrc - Optimized image URL with parameters.
 * @property blurDataURL - Base64-encoded LQIP placeholder image.
 * @property isLoading - Indicates whether the image is currently loading.
 * @property isError - Indicates whether an error occurred while loading the image.
 */
interface OptimizedImageResult {
  optimizedSrc: string;
  blurDataURL?: string | undefined;
  isLoading: boolean;
  isError: boolean;
}

/**
 * Hook for optimizing images with LQIP placeholders and lazy loading.
 *
 * @param props - Hook parameters object.
 * @param props.src - Image source URL.
 * @param props.width - Desired image width.
 * @param props.height - Desired image height.
 * @param props.quality - Image quality (1-100).
 *
 * @returns Optimized image data and loading states.
 */
export const useOptimizedImage = ({
  src,
  width,
  height,
  quality = 85,
}: {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
}): OptimizedImageResult => {
  const [blurDataURL, setBlurDataURL] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const optimizeImage = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        // Fetch LQIP preview from API endpoint
        const response = await fetch(
          `/api/lqip?url=${encodeURIComponent(src)}`,
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch LQIP: ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          setBlurDataURL(data.preview);
        }
      } catch (error) {
        if (isMounted) {
          setIsError(true);
          // eslint-disable-next-line no-console
          console.log('Error optimizing image:', error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    optimizeImage();

    return () => {
      isMounted = false;
    };
  }, [src]);

  // Generate optimized image URL with parameters
  const optimizedSrc = src
    ? `${src}${src.includes('?') ? '&' : '?'}${
        width ? `w=${width}&` : ''
      }${height ? `h=${height}&` : ''}q=${quality}`
    : '';

  return {
    optimizedSrc,
    blurDataURL,
    isLoading,
    isError,
  };
};
