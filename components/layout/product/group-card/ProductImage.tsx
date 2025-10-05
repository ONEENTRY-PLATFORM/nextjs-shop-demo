import type { JSX } from 'react';

import OptimizedImage from '@/components/shared/OptimizedImage';

/**
 * Group product image.
 * @param props          - Component props.
 * @param props.imageSrc - Image source.
 * @returns              Group product image.
 */
const ProductImage = ({ imageSrc }: { imageSrc: string }): JSX.Element => {
  return (
    <div
      className="relative h-[130px] w-[110px] shrink-0"
      role="img"
      aria-label="Product image"
    >
      <OptimizedImage
        fill
        sizes="(min-width: 600px) 66vw, 100vw"
        src={imageSrc}
        alt={'Product'}
        quality={75}
        className="mb-10 size-full shrink-0 rounded-xl object-cover max-md:mb-8 max-sm:mb-8"
      />
    </div>
  );
};

export default ProductImage;
