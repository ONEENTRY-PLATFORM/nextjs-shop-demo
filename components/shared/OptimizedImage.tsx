'use client';

import NextImage from 'next/image';
import type { FC } from 'react';
import { useRef, useState } from 'react';

// import { useOptimizedImage } from '@/components/hooks/useOptimizedImage';
import Image from './Image';
// import Placeholder from './Placeholder';

interface OptimizedImageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  src: any;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  fill?: boolean;
  priority?: string;
  className?: string;
  quality?: number;
  type?: string;
  loading?: string;
}

/**
 * Optimized image component with LQIP placeholder and lazy loading
 *
 * @param src Image source data
 * @param alt Image alt text
 * @param width Image width
 * @param height Image height
 * @param sizes Image sizes
 * @param priority Priority loading flag
 * @param className Additional CSS classes
 * @param quality Image quality (1-100)
 * @param loading Image loading behavior ("eager" | "lazy")
 * @returns Optimized image JSX element
 */
const OptimizedImage: FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  sizes,
  priority = '',
  className = '',
  quality,
  type = 'next',
  loading,
}) => {
  const [isImageLoading, setImageLoading] = useState(true);
  const ref = useRef<HTMLImageElement>(null);
  const optimizedSrc = src?.value?.downloadLink || src?.value[0]?.downloadLink;
  const blurDataURL = src?.value?.previewLink?.default?.[0] || '';

  // Handle the exactOptionalPropertyTypes issue by explicitly building the props object
  // const { optimizedSrc, blurDataURL, isLoading, isError } = useOptimizedImage({
  //   src,
  //   quality,
  //   ...(width !== undefined && { width }),
  //   ...(height !== undefined && { height }),
  // });

  // if (isError || !src) {
  //   return <Placeholder />;
  // }

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
    loading,
    className: `
      duration-300 ease-in-out
      ${isImageLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0 object-cover'}
      ${isImageLoading ? 'opacity-0' : 'opacity-100'}
    `,
    ref,
    onLoadingComplete: () => setImageLoading(false),
    onError: () => {
      setImageLoading(false);
    },
    sizes:
      width && height
        ? `${width}px`
        : sizes
          ? sizes
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
    <div className={`${className} overflow-hidden`} style={{ width, height }}>
      {type === 'next' ? (
        <NextImage {...imageProps} />
      ) : (
        <Image {...imageProps} />
      )}
      {/* {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )} */}
    </div>
  );
};

export default OptimizedImage;
