import Image from 'next/image';
import React from 'react';

interface ProductImageProps {
  imageSrc: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ imageSrc }) => {
  // console.log(imageSrc);

  return (
    <div className="relative flex w-[30%] grow flex-col max-md:w-full max-md:max-w-[48%] max-sm:w-full max-sm:max-w-full">
      <Image
        fill
        src={imageSrc}
        alt="Product"
        className="mb-10 size-full shrink-0 bg-slate-300 object-cover max-md:mb-8 max-sm:mb-8"
      />
    </div>
  );
};

export default ProductImage;
