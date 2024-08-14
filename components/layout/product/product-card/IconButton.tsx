'use client';
import Image from 'next/image';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import {
  addFavorites,
  removeFavorites,
  selectIsFavorites,
} from '@/app/store/reducers/FavoritesSlice';

interface IconButtonProps {
  product: IProductsEntity;
  imgSrc: string;
}

const IconButton: React.FC<IconButtonProps> = ({ product, imgSrc }) => {
  return (
    <button
      type="button"
      className="relative box-border flex aspect-square size-[26px] shrink-0 flex-col"
      onClick={() => addFavorites(product)}
    >
      <Image
        fill
        loading="lazy"
        src={imgSrc}
        alt=""
        className="relative shrink-0"
      />
    </button>
  );
};

export default IconButton;
