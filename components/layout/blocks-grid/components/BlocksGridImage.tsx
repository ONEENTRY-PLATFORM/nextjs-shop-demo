/* eslint-disable jsdoc/reject-any-type */
// import Image from 'next/image';
import type { JSX } from 'react';

import OptimizedImage from '@/components/shared/OptimizedImage';

/**
 * Blocks grid image component that renders an optimized image for block grid items
 * Extracts image data from attribute values and renders it with responsive sizing and hover effects
 * Uses OptimizedImage component for better performance with lazy loading and quality optimization
 * @param   {object}               props                 - Component props
 * @param   {Record<string, any>}  props.attributeValues - Block attribute values containing image data
 * @returns {Promise<JSX.Element>}                       Optimized image component with styling
 */
const BlocksGridImage = async ({
  attributeValues,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributeValues: Record<string, any>;
}): Promise<JSX.Element> => {
  /** Extract title and background image data from block attribute values */
  const { title = '', bg_web } = attributeValues;

  /** Render optimized image with responsive sizes, high priority loading and hover zoom effect */
  return (
    <OptimizedImage
      src={bg_web}
      alt={title.value}
      priority={'high'}
      quality={75}
      sizes="(min-width: 1024px) 66vw, 100vw"
      className="absolute left-0 top-0 z-0 size-full rounded-3xl object-cover transition-transform duration-500 group-hover:scale-125"
    />
  );
};

export default BlocksGridImage;
