import type { AttributeType } from 'oneentry/dist/base/utils';
import type { FC } from 'react';

import { getProductImageUrl } from '@/app/hooks/useProductsData';
import OptimizedImage from '@/components/shared/OptimizedImage';

interface ProductImageProps {
  attributes: AttributeType;
  alt: string;
}

/**
 * Product image component that displays the product image or a placeholder
 * @param attributes Product attributes containing the image data
 * @param alt Alternative text for the image
 * @returns Product image or placeholder component
 */
const ProductImage: FC<ProductImageProps> = ({ attributes, alt }) => {
  const imageSrc = getProductImageUrl(attributes);

  return (
    <div className="relative mb-3 size-40">
      {imageSrc && (
        <OptimizedImage
          src={imageSrc}
          alt={alt}
          priority={'high'}
          quality={85}
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="size-40 shrink-0 object-cover transition-transform duration-500 group-hover:scale-125"
        />
      )}
    </div>
  );
};

export default ProductImage;
