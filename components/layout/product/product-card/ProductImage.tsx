'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import OptimizedImage from '@/components/layout/product/product-card/OptimizedImage';

interface ProductImageProps {
  product: IProductsEntity;
  priority?: boolean;
}

/**
 * Product image component with optimization
 * @param product Product entity
 * @param priority Priority loading flag
 * @returns Product image JSX element
 */
const ProductImage: FC<ProductImageProps> = ({ product, priority = false }) => {
  // Extract image source from product attributes
  const imageSrc =
    product?.attributeValues?.pic?.value?.downloadLink || '/placeholder.jpg';

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-200">
      <OptimizedImage
        src={imageSrc}
        alt={product?.localizeInfos?.title || 'Product image'}
        priority={priority}
        quality={75}
      />
    </div>
  );
};

export default ProductImage;
