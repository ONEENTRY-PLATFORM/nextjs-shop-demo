import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { useAppSelector } from '@/app/store/hooks';

const EmptyFavorites = () => {
  const { empty_favorites_plug } = useAppSelector(
    (state) => state.systemContentReducer.content,
  );

  return (
    <div className="relative box-border flex shrink-0 flex-col items-center text-center">
      <Image
        className="mb-5"
        width={100}
        height={100}
        src={'/icons/heart.svg'}
        alt={''}
      />
      <h1 className="mb-5">{empty_favorites_plug}</h1>
      <Link href="/shop" className="underline">
        Go to shop
      </Link>
    </div>
  );
};

export default EmptyFavorites;
