import type { AttributeType } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

import OptimizedImage from '@/components/shared/OptimizedImage';

/**
 * ProductImage component displays an optimized product image with lazy loading.
 * It uses the OptimizedImage component for better performance and includes
 * hover effects for enhanced user experience. If no image is available,
 * it renders an empty container.
 * @param   {object}        props                 - Component properties
 * @param   {AttributeType} props.attributeValues - Product attributes containing the image source
 * @param   {string}        props.alt             - Alternative text for the image for accessibility
 * @returns {JSX.Element}                         A div container with the product image or empty container if no image
 */
const ProductImage = ({
  attributeValues,
  alt,
}: {
  attributeValues: AttributeType;
  alt: string;
}): JSX.Element => {
  /** Extract image source from product attributes */
  const imageSrc = attributeValues?.pic;

  return (
    <div className="relative mb-3 size-40">
      {imageSrc && (
        <OptimizedImage
          fill
          sizes="(min-width: 300px) 66vw, 100vw"
          src={imageSrc}
          alt={alt}
          loading="lazy"
          className="size-40 shrink-0 relative transition-transform duration-500 group-hover:scale-125"
        />
      )}
    </div>
  );
};

export default ProductImage;
