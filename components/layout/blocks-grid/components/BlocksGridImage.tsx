import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

import { getBlurDataURL } from '@/app/api/utils/getBlurDataURL';
import OptimizedImage from '@/components/shared/OptimizedImage';

/**
 * Blocks grid image component that renders an optimized image for block grid items
 * Extracts image data from attribute values and renders it with responsive sizing and hover effects
 * Uses OptimizedImage component for better performance with lazy loading and quality optimization.
 * Only the first (full-width) block is the LCP candidate and gets `priority`;
 * the remaining cards load lazily so they do not compete for the critical
 * bandwidth budget.
 * @param   {object}               props                 - Component props
 * @param   {IAttributeValues}     props.attributeValues - Block attribute values containing image data
 * @param   {number}               props.index           - Block position in the grid (0 = LCP candidate)
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

  /** Render optimized image with responsive sizes and hover zoom effect */
  return (
    <OptimizedImage
      src={bg_web}
      blurDataURL={blurDataURL}
      alt={(title?.value as string) || ''}
      priority={index === 0}
      loading={index === 0 ? 'eager' : 'lazy'}
      quality={75}
      sizes="(min-width: 1024px) 66vw, 100vw"
      className="absolute top-0 left-0 z-0 size-full rounded-3xl object-cover transition-transform duration-500 group-hover:scale-125"
    />
  );
};

export default BlocksGridImage;
