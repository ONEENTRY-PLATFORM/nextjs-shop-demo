import Image from 'next/image';
import type React from 'react';
import type { FC } from 'react';

import Placeholder from '@/components/shared/Placeholder';

/**
 * Blocks grid image
 *
 * @returns block card with animations
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BlocksGridImage: FC<any> = async ({ attributeValues }) => {
  // extract data from block attributeValues
  const { title = '', bg_web } = attributeValues;

  const imageSrc = bg_web?.value[0]?.downloadLink;

  if (!imageSrc) {
    return (
      <div className="absolute left-0 top-0 z-0 size-full rounded-3xl object-cover opacity-15 invert">
        <Placeholder />
      </div>
    );
  }

  return (
    <Image
      fill
      sizes="(min-width: 1024px) 66vw, 100vw"
      src={imageSrc}
      fetchPriority="high"
      alt={title?.value || ''}
      className="absolute left-0 top-0 z-0 size-full rounded-3xl object-cover transition-transform duration-500 group-hover:scale-125"
    />
  );
};

export default BlocksGridImage;
