'use client';

import { useEffect, useState } from 'react';

interface UseOptimizedImageProps {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
}

interface OptimizedImageResult {
  optimizedSrc: string;
  blurDataURL?: string | undefined;
  isLoading: boolean;
  isError: boolean;
}

/**
 * Hook for optimizing images with LQIP placeholders and lazy loading
 *
 * @param src Image source URL
 * @param width Desired image width
 * @param height Desired image height
 * @param quality Image quality (1-100)
 * @returns Optimized image data and loading states
 */
export const useOptimizedImage = ({
  src,
  width,
  height,
  quality = 85,
}: UseOptimizedImageProps): OptimizedImageResult => {
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
          console.error('Error optimizing image:', error);
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
