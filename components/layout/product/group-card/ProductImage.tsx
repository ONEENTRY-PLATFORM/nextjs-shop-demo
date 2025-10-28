import Image from 'next/image';
import type { JSX } from 'react';

/**
 * Group product image component.
 * Displays a product image with optimized loading and responsive sizing.
 * @param   {object}      props          - Component props.
 * @param   {string}      props.imageSrc - Image source URL.
 * @returns {JSX.Element}                Group product image.
 */
const ProductImage = ({ imageSrc }: { imageSrc: string }): JSX.Element => {
  console.log(imageSrc);
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
        alt={'Product'}
        quality={75}
        className="mb-10 size-full shrink-0 rounded-xl object-cover max-md:mb-8 max-sm:mb-8"
      />
    </div>
  );
};

export default ProductImage;
