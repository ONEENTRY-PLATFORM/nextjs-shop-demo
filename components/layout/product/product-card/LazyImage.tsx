'use client';

import Image from 'next/image';
import type { FC, ImgHTMLAttributes } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useIntersectionObserver } from '@/app/hooks/useIntersectionObserver';
import { preloadImage } from '@/app/utils/imagePreloader';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  preload?: boolean;
}

/**
 * Lazy image component with intersection observer and optional preloading
 * @param src Image source URL
 * @param alt Image alt text
 * @param placeholder Placeholder image URL
 * @param preload Whether to preload the image
 * @param props Additional image attributes
 * @returns Lazy loaded image JSX element
 */
const LazyImage: FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  preload = false,
  width,
  height,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

  // Preload image if requested
  useEffect(() => {
    if (preload && src) {
      preloadImage({ src }).then((result) => {
        if (!result.success) {
          // eslint-disable-next-line no-console
          console.warn(`Failed to preload image: ${src}`, result.error);
        }
      });
    }
  }, [preload, src]);

  // Load image when it becomes visible
  useEffect(() => {
    if (isIntersecting && src && !isLoaded) {
      const img = document.createElement('img');

      img.onload = () => {
        setIsLoaded(true);
        setIsLoading(false);
      };

      img.onerror = () => {
        setIsLoading(false);
        setHasError(true);
      };

      img.src = src;

      // If the image is already cached, onload might be called immediately
      if (img.complete) {
        setIsLoaded(true);
        setIsLoading(false);
      }
    }
  }, [isIntersecting, src, isLoaded]);

  // Convert width/height to proper types for Next.js Image component
  const convertToImageProp = (
    value: string | number | undefined,
  ): number | `${number}` | undefined => {
    if (value === undefined) return undefined;
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && /^\d+$/.test(value))
      return value as `${number}`;
    return undefined;
  };

  const imageWidth = convertToImageProp(width);
  const imageHeight = convertToImageProp(height);

  // Show placeholder while loading or if there's an error
  if (!isIntersecting || isLoading || hasError) {
    return (
      <div
        ref={ref}
        className={`
          relative overflow-hidden bg-gray-200
          ${props.className || ''}
          ${isLoading ? 'animate-pulse' : ''}
        `}
        style={{
          width: width,
          height: height,
        }}
      >
        {placeholder && (
          <Image
            src={placeholder}
            alt={alt}
            fill
            className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          {hasError && (
            <span className="text-gray-500 text-xs">Failed to load image</span>
          )}
        </div>
      </div>
    );
  }

  // Render the actual image when loaded
  return (
    <div ref={ref} className={`relative ${props.className || ''}`}>
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill={!width && !height}
        {...(imageWidth !== undefined && { width: imageWidth })}
        {...(imageHeight !== undefined && { height: imageHeight })}
        {...props}
        className={`
          transition-opacity duration-300 ease-in-out
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${props.className || ''}
        `}
      />
    </div>
  );
};

export default LazyImage;
