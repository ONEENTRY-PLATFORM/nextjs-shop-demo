'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import OptimizedImage from '@/components/hooks/OptimizedImage';

interface ProductImageProps {
  product: IProductsEntity;
  priority?: boolean;
}

/**
 * Safely extracts the product title from localized information
 * @param product The product entity
 * @returns The product title or a fallback string
 */
const getProductTitle = (product: IProductsEntity): string => {
  if (
    product?.localizeInfos &&
    typeof product.localizeInfos === 'object' &&
    'title' in product.localizeInfos &&
    typeof product.localizeInfos.title === 'string'
  ) {
    return product.localizeInfos.title;
  }
  return 'Product image';
};

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

  // Safely extract product title from localized info
  const productTitle = getProductTitle(product);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-200">
      <OptimizedImage
        src={imageSrc}
        alt={productTitle}
        priority={priority}
        quality={75}
      />
    </div>
  );
};

export default ProductImage;
