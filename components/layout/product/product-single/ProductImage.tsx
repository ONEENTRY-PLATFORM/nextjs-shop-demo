import Image from 'next/image';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import Placeholder from '@/components/shared/Placeholder';

import FavoritesButton from '../../../shared/FavoritesButton';

interface ProductImageProps {
  imageSrc: string;
  alt: string;
  product: IProductsEntity;
}

const ProductImage: FC<ProductImageProps> = async ({
  imageSrc,
  alt,
  product,
}) => {
  return (
    <>
      <div className="absolute right-2 top-2 z-10">
        <FavoritesButton {...product} />
      </div>
      {imageSrc ? (
        <Image
          fill
          sizes="(min-width: 1024px) 30vw, 100vw"
          src={imageSrc}
          alt={alt || ''}
          className="size-full rounded-xl bg-slate-50 object-cover"
        />
      ) : (
        <Placeholder />
      )}
    </>
  );
};

export default ProductImage;
