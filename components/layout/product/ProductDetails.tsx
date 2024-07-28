import React from 'react';

interface ProductDetailsProps {
  productName: string;
  productType: string;
  price: number;
  stock: number;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  productName,
  productType,
  price,
  stock
}) => {
  return (
    <div className="flex flex-col pt-1.5 w-1/5 max-md:mt-10">
      <h2 className="text-xl leading-6 text-neutral-600">{productName}</h2>
      <p className="mt-3 text-sm leading-4 text-neutral-600">{productType}</p>
      <p className="mt-4 mb-5 text-xl font-bold leading-8 text-left text-neutral-600">
        $ {price}
      </p>
      <div className="box-border flex relative flex-col shrink-0">
        <div className="self-end text-sm text-slate-300">{stock} units</div>
        <div className="flex flex-row justify-start pr-16 mt-1.5 rounded-xl bg-zinc-300 max-md:pl-5">
          <div className="shrink-0 mr-auto bg-orange-500 rounded-xl h-[3px] w-[70%]" />
        </div>
      </div>
      <button className="px-5 py-4 mt-6 text-base font-bold text-center text-white uppercase bg-orange-500 border border-orange-500 border-solid rounded-[30px] max-md:px-5">
        Add to cart
      </button>
    </div>
  );
};

export default ProductDetails;