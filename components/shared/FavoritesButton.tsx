'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  addFavorites,
  removeFavorites,
  selectIsFavorites,
} from '@/app/store/reducers/FavoritesSlice';

const FavoritesButton: FC<IProductsEntity> = (product) => {
  const [isFav, setIsFav] = useState(false);
  const dispatch = useAppDispatch();
  const isFavorites = useAppSelector((state) =>
    selectIsFavorites(state, product.id),
  );

  useEffect(() => {
    if (!isFavorites) {
      return;
    }
    setIsFav(isFavorites);
  }, [isFavorites]);

  if (!product) {
    return;
  }

  return (
    <button
      type="button"
      className="relative box-border flex size-[26px] shrink-0 flex-col items-center justify-center"
      onClick={() => {
        if (isFav) {
          dispatch(removeFavorites(product.id));
        } else {
          dispatch(addFavorites(product));
        }
      }}
    >
      {!isFav ? (
        <svg
          width="20"
          height="16"
          viewBox="0 0 20 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.31893 1.39836C8.33426 0.509955 6.97322 0 5.45455 0C4.00843 0.00157648 2.62202 0.540004 1.59946 1.49717C0.576899 2.45433 0.00168419 3.75208 0 5.10571C0 7.59049 1.65455 10.1765 4.91818 12.7907C6.41368 13.9835 8.0291 15.0379 9.74182 15.9392C9.82119 15.9791 9.90989 16 10 16C10.0901 16 10.1788 15.9791 10.2582 15.9392C11.9709 15.0379 13.5863 13.9835 15.0818 12.7907C18.3455 10.1765 20 7.59049 20 5.10571C19.9983 3.75208 19.4231 2.45433 18.4005 1.49717C17.378 0.540004 15.9916 0.00157648 14.5455 0C13.0268 0 11.6657 0.509955 10.6811 1.39836C10.4279 1.62674 10.1997 1.88014 10 2.15631C9.80033 1.88014 9.57207 1.62674 9.31893 1.39836ZM14.5449 1C12.9154 1.00015 11.5755 1.68388 10.8104 2.74221L10 3.8631L9.18961 2.74221C8.42446 1.68388 7.08457 1.00015 5.45509 1C4.25349 1.00144 3.11372 1.44949 2.28284 2.22724C1.45421 3.00287 1.0015 4.03981 1 5.10634C1.00028 7.1306 2.35902 9.45934 5.54245 12.0094C6.92744 13.1141 8.41965 14.0965 10 14.944C11.5803 14.0966 13.0725 13.1141 14.4575 12.0095C17.6406 9.45965 18.9994 7.1311 19 5.10696M14.5449 1C15.7465 1.00144 16.8863 1.44949 17.7172 2.22724C18.5459 3.00299 18.9986 4.04025 19 5.10696"
            fill="#4C4D56"
          />
        </svg>
      ) : (
        <svg
          width="21"
          height="16"
          viewBox="0 0 21 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.4929 0C13.5838 0 11.9238 0.805852 10.9475 2.15631C9.9711 0.805852 8.3111 0 6.40201 0C4.95589 0.00157648 3.56948 0.540004 2.54692 1.49717C1.52436 2.45433 0.949148 3.75208 0.947464 5.10571C0.947464 7.59049 2.60201 10.1765 5.86565 12.7907C7.36115 13.9835 8.97657 15.0379 10.6893 15.9392C10.7687 15.9791 10.8574 16 10.9475 16C11.0376 16 11.1263 15.9791 11.2056 15.9392C12.9184 15.0379 14.5338 13.9835 16.0293 12.7907C19.2929 10.1765 20.9475 7.59049 20.9475 5.10571C20.9458 3.75208 20.3706 2.45433 19.348 1.49717C18.3254 0.540004 16.939 0.00157648 15.4929 0Z"
            fill="#EC722B"
          />
        </svg>
      )}
    </button>
  );
};

export default FavoritesButton;
