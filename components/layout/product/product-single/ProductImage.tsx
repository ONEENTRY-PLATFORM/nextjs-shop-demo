import Image from 'next/image';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import FavoritesButton from '../../catalog/product-card/FavoritesButton';

interface ProductImageProps {
  imageSrc: string;
  alt: string;
  product: IProductsEntity;
}

const ProductImage: React.FC<ProductImageProps> = ({
  imageSrc,
  alt,
  product,
}) => {
  return (
    <>
      <div className="absolute right-2 top-2 z-10">
        <FavoritesButton {...product} />
      </div>
      {imageSrc && (
        <Image
          fill
          sizes="(min-width: 1024px) 30vw, 100vw"
          src={imageSrc}
          alt={alt || ''}
          className="size-full rounded-xl bg-slate-50 object-cover"
        />
      )}
    </>
  );
};

export default ProductImage;
