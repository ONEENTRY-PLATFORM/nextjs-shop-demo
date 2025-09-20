import Image from 'next/image';
import type { AttributeType } from 'oneentry/dist/base/utils';
import type { FC } from 'react';

import Placeholder from '@/components/shared/Placeholder';

import { getProductImageUrl } from '../../../../hooks/useProductsData';

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
      {imageSrc ? (
        <Image
          fill
          sizes="(min-width: 300px) 66vw, 100vw"
          src={imageSrc}
          alt={alt}
          loading="lazy"
          className="size-40 shrink-0 object-cover transition-transform duration-500 group-hover:scale-125"
        />
      ) : (
        <Placeholder />
      )}
    </div>
  );
};

export default ProductImage;
