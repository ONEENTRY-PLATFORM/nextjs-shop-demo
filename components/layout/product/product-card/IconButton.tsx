'use client';
import Image from 'next/image';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { useAppDispatch } from '@/app/store/hooks';
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
        src={imgSrc}
        alt=""
        className="relative shrink-0"
      />
    </button>
  );
};

export default IconButton;
