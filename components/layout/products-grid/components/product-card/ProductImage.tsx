import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import { getProductImageUrl } from '@/app/hooks/useProductsData';
import OptimizedImage from '@/components/shared/OptimizedImage';

interface ProductImageProps {
  product: IProductsEntity;
  alt: string;
}

/**
 * Product image component that displays the product image or a placeholder
 * @param product Product containing the image data
 * @param alt Alternative text for the image
 * @returns Product image or placeholder component
 */
const ProductImage: FC<ProductImageProps> = ({ product, alt }) => {
  const imageSrc = getProductImageUrl('pic', product);

  return (
    <div className="relative mb-3 size-40">
      <OptimizedImage
        src={imageSrc}
        alt={alt}
        priority={'high'}
        quality={85}
        type="img"
        sizes="(min-width: 1024px) 66vw, 100vw"
        className="size-40 shrink-0 object-cover transition-transform duration-500 group-hover:scale-125"
      />
    </div>
  );
};

export default ProductImage;
