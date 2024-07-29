import React from 'react';

interface ProductImageProps {
  imageSrc: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ imageSrc }) => {
  return (
    <div className="shrink-0 bg-white rounded-xl h-[130px] w-[110px]" role="img" aria-label="Product image">
      <img
        src={imageSrc}
        alt="Product"
        className="shrink-0 mb-10 bg-slate-300 h-[280px] max-md:mb-8 max-sm:mb-8 max-sm:w-full"
      />
    </div>
  );
};

export default ProductImage;