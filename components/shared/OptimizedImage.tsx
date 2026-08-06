'use client';

import NextImage from 'next/image';
import type { JSX } from 'react';
import { useEffect, useRef, useState } from 'react';

import Image from './Image';
import Placeholder from './Placeholder';
// import Placeholder from './Placeholder';

/**
 * Optimized image component with LQIP placeholder and lazy loading.
 * @param   {object}      props             - OptimizedImage component props.
 * @param   {object}      props.src         - Image source data.
 * @param   {string}      props.alt         - Image alt text.
 * @param   {number}      props.width       - Image width.
 * @param   {number}      props.height      - Image height.
 * @param   {string}      props.sizes       - Image sizes.
 * @param   {boolean}     props.fill        - Fill parent container.
 * @param   {boolean}     props.priority    - Priority loading flag.
 * @param   {string}      props.className   - Additional CSS classes.
 * @param   {number}      props.quality     - Image quality (1-100).
 * @param   {string}      props.type        - Image type ("next" | "custom").
 * @param   {string}      props.loading     - Image loading behavior ("eager" | "lazy").
 * @param   {string}      props.blurDataURL - Precomputed blur placeholder (base64 data URI); overrides the CMS preview when provided.
 * @returns {JSX.Element}                   JSX.Element - Optimized image.
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  className = '',
  quality,
  type = 'next',
  loading,
  blurDataURL,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  src: any;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  quality?: number;
  type?: string;
  loading?: 'eager' | 'lazy';
  blurDataURL?: string | undefined;
}): JSX.Element => {
  /** Track image loading state for animations */
  const [isImageLoading, setImageLoading] = useState(true);
  const ref = useRef<HTMLImageElement>(null);

  /**
   * Above-the-fold images (`priority` / `loading="eager"`) are revealed
   * immediately instead of waiting for React's `onLoad`.
   *
   * The reveal-on-load effect hides the image with `opacity-0` until the
   * handler fires, and that handler cannot run before hydration. For an image
   * that came with the server HTML this means the LCP candidate is painted at
   * `opacity: 0` — invisible to the browser's LCP bookkeeping — so the metric
   * only lands after the bundle has hydrated, no matter how fast the image
   * itself arrived. The blur placeholder (`blurDataURL`) already covers the
   * gap before the bytes land, so there is nothing to hide.
   */
  const revealImmediately = priority || loading === 'eager';

  /**
   * Cached or already-decoded images can finish loading *before* React
   * attaches its listener, and a `load` event that already fired is never
   * replayed — the image would stay stuck at `opacity-0`. Clear the loading
   * state on mount when the element reports itself complete.
   */
  useEffect(() => {
    if (ref.current?.complete) {
      setImageLoading(false);
    }
  }, []);

  /**
   * Resolve the image URL. `src` is either a raw OneEntry image attribute
   * (`{ value }`, object- or array-shaped), or a plain URL string (e.g. category
   * cards, which receive a pre-resolved URL from `getImageUrl`).
   */
  const optimizedSrc =
    typeof src === 'string'
      ? src
      : src?.value?.downloadLink || src?.value?.[0]?.downloadLink;

  /**
   * Resolve the blur placeholder. Priority: an explicit `blurDataURL` prop
   * (computed server-side — CMS preview or generated LQIP) wins; otherwise fall
   * back to the CMS-generated preview embedded in the attribute value
   * (`previewLink.default[0]`, a base64 data URI). Handles both object- and
   * array-shaped image values.
   */
  const attrValue = typeof src === 'string' ? undefined : src?.value;
  const attrFirst = Array.isArray(attrValue) ? attrValue[0] : attrValue;
  const attrPreview = attrFirst?.previewLink;
  const cmsBlur =
    attrPreview && typeof attrPreview === 'object'
      ? attrPreview.default?.[0]
      : undefined;
  const resolvedBlur = blurDataURL || cmsBlur || '';

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
      /**
       * Raise the network priority of above-the-fold images. Next.js maps
       * `priority` to `preload` and to "not lazy" only — it does **not** emit
       * `fetchpriority="high"` on the `<img>` itself (see `get-img-props.js`),
       * which is what the browser uses to order the request against the rest
       * of the page. Passing it explicitly is what makes the LCP candidate win
       * the queue instead of merely being discoverable.
       */
      ...(revealImmediately && { fetchPriority: 'high' as const }),
      /**
       * Only set `loading` when it's explicitly provided. When `priority` is
       * true Next.js requires `loading` to be unset (or 'eager'), otherwise
       * it logs a conflict warning.
       */
      ...(loading !== undefined && { loading }),
      className: `
        duration-300 ease-in-out
        ${isImageLoading && !revealImmediately ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0 object-cover'}
        ${isImageLoading && !revealImmediately ? 'opacity-0' : 'opacity-100'}
      `,
      // eslint-disable-next-line react-hooks/refs
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
    if (resolvedBlur) {
      return {
        ...baseProps,
        placeholder: 'blur',
        blurDataURL: resolvedBlur,
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
