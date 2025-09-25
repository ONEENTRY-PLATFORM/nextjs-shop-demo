import type { AttributeType } from 'oneentry/dist/base/utils';
import type { FC } from 'react';

import OptimizedImage from '@/components/shared/OptimizedImage';

interface ProductImageProps {
  attributeValues: AttributeType;
  alt: string;
}

/**
 * Product image
 *
 * @param attributes - product attributes
 * @param alt - alt text for image
 * @returns Product image/placeholder
 */
const ProductImage: FC<ProductImageProps> = ({
  attributeValues: { pic },
  alt,
}) => {
  const imageSrc = pic?.value?.downloadLink;

  return (
    <div className="relative mb-3 size-40">
      {imageSrc && (
        <OptimizedImage
          fill
          sizes="(min-width: 300px) 66vw, 100vw"
          src={pic}
          alt={alt}
          loading="lazy"
          className="size-40 shrink-0 relative transition-transform duration-500 group-hover:scale-125"
        />
      )}
    </div>
  );
};

export default ProductImage;
