'use client';

import Image from 'next/image';
import type { FC } from 'react';
import { useState } from 'react';

import { useOptimizedImage } from '@/components/hooks/useOptimizedImage';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  quality?: number;
}

/**
 * Optimized image component with LQIP placeholder and lazy loading
 * @param src Image source URL
 * @param alt Image alt text
 * @param width Image width
 * @param height Image height
 * @param priority Priority loading flag
 * @param className Additional CSS classes
 * @param quality Image quality (1-100)
 * @returns Optimized image JSX element
 */
const OptimizedImage: FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  quality = 75,
}) => {
  // Handle the exactOptionalPropertyTypes issue by explicitly building the props object
  const useOptimizedImageProps = {
    src,
    quality,
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
  };

  const { optimizedSrc, blurDataURL, isLoading, isError } = useOptimizedImage(
    useOptimizedImageProps,
  );

  const [isImageLoading, setImageLoading] = useState(true);

  if (isError || !src) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-xs">Image not available</span>
      </div>
    );
  }

  // Prepare props for Next.js Image component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageProps: any = {
    src: optimizedSrc,
    alt,
    fill: !width && !height,
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
    priority,
    quality,
    className: `
      duration-700 ease-in-out
      ${isImageLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}
      ${isLoading ? 'opacity-0' : 'opacity-100'}
    `,
    onLoadingComplete: () => setImageLoading(false),
    onError: () => {
      setImageLoading(false);
    },
    sizes:
      width && height
        ? `${width}px`
        : '(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw',
  };

  // Conditionally add placeholder and blurDataURL only when they exist
  if (blurDataURL) {
    imageProps.placeholder = 'blur';
    imageProps.blurDataURL = blurDataURL;
  } else {
    imageProps.placeholder = 'empty';
  }

  return (
    <div
      className={`${className} relative overflow-hidden`}
      style={{ width, height }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      <Image {...imageProps} />
    </div>
  );
};

export default OptimizedImage;
