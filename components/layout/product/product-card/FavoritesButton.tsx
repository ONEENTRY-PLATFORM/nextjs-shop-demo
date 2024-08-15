'use client';
import Image from 'next/image';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { useAppDispatch } from '@/app/store/hooks';
import {
  addFavorites,
  removeFavorites,
  selectIsFavorites,
} from '@/app/store/reducers/FavoritesSlice';

const FavoritesButton: React.FC<IProductsEntity> = (product) => {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      className="relative box-border flex aspect-square size-[26px] shrink-0 flex-col"
      onClick={() => dispatch(addFavorites(product))}
    >
      <Image
        width={24}
        height={24}
        loading="lazy"
        src="/icons/heart.svg"
        alt=""
        className="relative shrink-0"
      />
    </button>
  );
};

export default FavoritesButton;
