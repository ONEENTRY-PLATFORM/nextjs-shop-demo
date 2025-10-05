import type { AttributeType } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

import OptimizedImage from '@/components/shared/OptimizedImage';

/**
 * Product image.
 * @param   {object}        props                 - Component props.
 * @param   {AttributeType} props.attributeValues - product attributes.
 * @param   {string}        props.alt             - alt text for image.
 * @returns {JSX.Element}                         - Product image/placeholder.
 */
const ProductImage = ({
  attributeValues,
  alt,
}: {
  attributeValues: AttributeType;
  alt: string;
}): JSX.Element => {
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
