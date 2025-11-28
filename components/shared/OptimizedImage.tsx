'use client';

import NextImage from 'next/image';
import type { JSX } from 'react';
import { useRef, useState } from 'react';

import Image from './Image';
import Placeholder from './Placeholder';
// import Placeholder from './Placeholder';

/**
 * Optimized image component with LQIP placeholder and lazy loading.
 * @param   {object}      props           - OptimizedImage component props.
 * @param   {object}      props.src       - Image source data.
 * @param   {string}      props.alt       - Image alt text.
 * @param   {number}      props.width     - Image width.
 * @param   {number}      props.height    - Image height.
 * @param   {string}      props.sizes     - Image sizes.
 * @param   {boolean}     props.fill      - Fill parent container.
 * @param   {string}      props.priority  - Priority loading flag.
 * @param   {string}      props.className - Additional CSS classes.
 * @param   {number}      props.quality   - Image quality (1-100).
 * @param   {string}      props.type      - Image type ("next" | "custom").
 * @param   {string}      props.loading   - Image loading behavior ("eager" | "lazy").
 * @returns {JSX.Element}                 JSX.Element - Optimized image.
 */
const OptimizedImage = ({
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
}: {
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
}): JSX.Element => {
  /** Track image loading state for animations */
  const [isImageLoading, setImageLoading] = useState(true);
  const ref = useRef<HTMLImageElement>(null);

  /** Extract image URL from source data structure */
  const optimizedSrc =
    src?.value?.downloadLink || src?.value?.[0]?.downloadLink;

  /** Extract low-quality placeholder image for blur effect */
  const blurDataURL = src?.value?.previewLink?.default?.[0] || '';

  /** Show placeholder if no image source is available */
  if (!optimizedSrc) {
    return <Placeholder />;
  }

  /**
   * Prepare props for Next.js Image component
   * @returns {object} - Image props
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getImageProps = (): any => {
    const baseProps = {
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
      onLoad: () => setImageLoading(false),
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

    /** Conditionally add placeholder and blurDataURL only when they exist */
    if (blurDataURL) {
      return {
        ...baseProps,
        placeholder: 'blur',
        blurDataURL: blurDataURL,
      };
    } else {
      return {
        ...baseProps,
        placeholder: 'empty',
      };
    }
  };

  const imageProps = getImageProps();

  return (
    <div className={`${className} overflow-hidden`} style={{ width, height }}>
      {type === 'next' ? (
        <NextImage {...imageProps} />
      ) : (
        <Image {...imageProps} alt={alt} />
      )}
      {/* {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )} */}
    </div>
  );
};

export default OptimizedImage;
