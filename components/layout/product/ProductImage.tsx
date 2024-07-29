import React from "react";

interface ProductImageProps {
  imageSrc: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ imageSrc }) => {
  return (
    <div className="flex flex-col grow w-[30%] max-md:w-full max-md:max-w-[48%] max-sm:w-full max-sm:max-w-full">
      <img
        src={imageSrc}
        alt="Product"
        className="shrink-0 bg-slate-300 h-full mb-10 max-md:mb-8 max-sm:mb-8 w-full object-cover"
      />
    </div>
  );
};

export default ProductImage;
