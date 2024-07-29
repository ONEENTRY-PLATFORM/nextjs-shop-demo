import React from 'react';
import IconButton from './IconButton';
import PriceDisplay from './PriceDisplay';
import AddToCartButton from './AddToCartButton';

interface ProductCardProps {
  product: {
    imageUrl: string;
    setName: string;
    itemCount: string;
    itemNames: string;
    currentPrice: number;
    originalPrice: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    imageUrl,
    setName,
    itemCount = 2,
    itemNames = "itemNames",
    currentPrice,
    originalPrice
  } = product;

  return (
    <article className="flex flex-col items-center p-4 w-full rounded-3xl bg-neutral-100">
      <header className="flex gap-5 justify-between self-stretch">
        <IconButton iconSrc="./icons/heart.svg" />
        <IconButton iconSrc="./icons/heart.svg" />
      </header>
      <img 
        src={imageUrl}
        alt={`Product image for ${setName}`} 
        className="shrink-0 mt-7 w-40 h-40 bg-zinc-300" 
      />
      <section className="flex flex-col gap-2.5 mt-12 mb-5 max-w-full w-[153px]">
        <h2 className="text-sm leading-4 text-center text-neutral-600">
          {setName} ({itemCount} items)
        </h2>
        <p className="text-sm leading-4 text-center text-neutral-600">
          {itemNames}
        </p>
        <PriceDisplay 
          currentPrice={currentPrice} 
          originalPrice={originalPrice} 
        />
        <AddToCartButton />
      </section>
    </article>
  );
};

export default ProductCard;