import Image from 'next/image';
import type { FC } from 'react';

interface ProductImageProps {
  imageSrc: string;
}

/**
 * Group product image
 * @param imageSrc
 *
 * @returns Group product image
 */
const ProductImage: FC<ProductImageProps> = ({ imageSrc }) => {
  return (
    <div
      className="relative h-[130px] w-[110px] shrink-0"
      role="img"
      aria-label="Product image"
    >
      <Image
        fill
        sizes="(min-width: 600px) 66vw, 100vw"
        src={imageSrc}
        alt="Product"
        className="mb-10 size-full shrink-0 rounded-xl object-cover max-md:mb-8 max-sm:mb-8"
      />
    </div>
  );
};

export default ProductImage;
