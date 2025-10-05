/* eslint-disable @typescript-eslint/no-explicit-any */
// import Image from 'next/image';
import type React from 'react';
import type { JSX } from 'react';

import OptimizedImage from '@/components/shared/OptimizedImage';

/**
 * Blocks grid image.
 * @param props                 - block props.
 * @param props.attributeValues - block attributeValues.
 * @returns                     block card with animations.
 */
const BlocksGridImage = async ({
  attributeValues,
}: {
  attributeValues: any;
}): Promise<JSX.Element> => {
  // extract data from block attributeValues
  const { title = '', bg_web } = attributeValues;

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
