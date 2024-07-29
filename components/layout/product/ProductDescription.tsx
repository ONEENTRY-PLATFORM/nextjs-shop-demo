import React from 'react';

interface ProductDescriptionProps {
  description: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
  return (
    <div className="flex flex-col grow w-2/5 max-md:mt-10">
      <div className="box-border flex relative flex-col shrink-0 mb-6" >
        variations
      </div>
      <p className="text-sm leading-5 text-neutral-600">
        {description}
      </p>
    </div>
  );
};

export default ProductDescription;