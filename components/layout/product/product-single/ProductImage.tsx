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
    <div className="relative mb-10 flex h-[280px] w-[30%] grow flex-col max-md:w-full max-md:max-w-[48%] max-sm:w-full max-sm:max-w-full">
      <div className="absolute right-2 top-2 z-10">
        <FavoritesButton {...product} />
      </div>
      <Image
        fill
        sizes="(min-width: 1024px) 30vw, 100vw"
        src={imageSrc}
        alt={alt}
        className="size-full shrink-0 bg-slate-300 object-cover"
      />
    </div>
  );
};

export default ProductImage;
