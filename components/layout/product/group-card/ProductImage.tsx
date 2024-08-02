import Image from 'next/image';
import React from 'react';

interface ProductImageProps {
  imageSrc: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ imageSrc }) => {
  return (
    <div
      className="relative h-[130px] w-[110px] shrink-0"
      role="img"
      aria-label="Product image"
    >
      <Image
        fill
        src={imageSrc}
        alt="Product"
        className="mb-10 size-full shrink-0 rounded-xl object-cover max-md:mb-8 max-sm:mb-8"
      />
    </div>
  );
};

export default ProductImage;
