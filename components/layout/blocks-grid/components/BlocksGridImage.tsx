// import Image from 'next/image';
import type React from 'react';
import type { FC } from 'react';

import OptimizedImage from '@/components/shared/OptimizedImage';

/**
 * Blocks grid image
 *
 * @returns block card with animations
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BlocksGridImage: FC<{ attributeValues: any }> = async ({
  attributeValues,
}) => {
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
