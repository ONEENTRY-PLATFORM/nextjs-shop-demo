import Image from 'next/image';
import type { AttributeType } from 'oneentry/dist/base/utils';
import type { FC } from 'react';

import Placeholder from '@/components/shared/Placeholder';

interface ProductImageProps {
  attributes: AttributeType;
  alt: string;
}

/**
 * Product image
 * @param attributes
 * @param alt
 *
 * @returns Product image/placeholder
 */
const ProductImage: FC<ProductImageProps> = ({ attributes: { pic }, alt }) => {
  const productImage = pic?.value;
  const imageSrc = Array.isArray(productImage)
    ? productImage[0]?.downloadLink
    : productImage?.downloadLink;

  return (
    <div className="relative mb-3 size-40">
      {imageSrc ? (
        <Image
          fill
          sizes="(min-width: 300px) 66vw, 100vw"
          src={imageSrc}
          alt={alt}
          className="size-40 shrink-0 object-cover transition-transform duration-500 group-hover:scale-125"
        />
      ) : (
        <Placeholder />
      )}
    </div>
  );
};

export default ProductImage;
