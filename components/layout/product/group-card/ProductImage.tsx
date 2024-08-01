import Image from 'next/image';
import React from "react";

interface ProductImageProps {
  imageSrc: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ imageSrc }) => {
  return (
    <div
      className="shrink-0 h-[130px] w-[110px]"
      role="img"
      aria-label="Product image"
    >
      <Image
        src={imageSrc}
        alt="Product"
        className="shrink-0 rounded-xl mb-10 w-full h-full max-md:mb-8 max-sm:mb-8 object-cover"
      />
    </div>
  );
};

export default ProductImage;
