import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

import { getBlurDataURL } from '@/app/api/utils/getBlurDataURL';
import OptimizedImage from '@/components/shared/OptimizedImage';

/**
 * Blocks grid image component that renders an optimized image for block grid items
 * Extracts image data from attribute values and renders it with responsive sizing and hover effects
 * Uses OptimizedImage component for better performance with lazy loading and quality optimization.
 * The first two blocks sit above the fold on mobile — the full-width banner
 * (175px tall) plus the first 260px card — and both get `priority`, so
 * whichever of them Chrome picks as the LCP element is preloaded and eager.
 * Measured: with `priority` on index 0 only, the LCP candidate was the *second*
 * block (`offer_promotion`), left with `loading="lazy"` and no priority hint.
 * The remaining cards stay lazy so they do not compete for critical bandwidth.
 * @param   {object}               props                 - Component props
 * @param   {IAttributeValues}     props.attributeValues - Block attribute values containing image data
 * @param   {number}               props.index           - Block position in the grid (0-1 = above the fold)
 * @returns {Promise<JSX.Element>}                       Optimized image component with styling
 */
const BlocksGridImage = async ({
  attributeValues,
  index,
}: {
  attributeValues: IAttributeValues;
  index: number;
}): Promise<JSX.Element> => {
  /** Extract title and background image data from block attribute values */
  const { title, bg_web } = attributeValues;

  /**
   * Resolve the blur placeholder server-side: CMS preview when present,
   * otherwise a generated LQIP (sharp cannot run in the client OptimizedImage).
   */
  const blurDataURL = await getBlurDataURL('bg_web', attributeValues);

  /** Blocks visible in the mobile first screen — the LCP candidate is one of them */
  const isAboveTheFold = index < 2;

  /** Render optimized image with responsive sizes and hover zoom effect */
  return (
    <OptimizedImage
      src={bg_web}
      blurDataURL={blurDataURL}
      alt={(title?.value as string) || ''}
      priority={isAboveTheFold}
      loading={isAboveTheFold ? 'eager' : 'lazy'}
      quality={75}
      sizes="(min-width: 1024px) 66vw, 100vw"
      className="absolute top-0 left-0 z-0 size-full rounded-3xl object-cover transition-transform duration-500 group-hover:scale-125"
    />
  );
};

export default BlocksGridImage;
