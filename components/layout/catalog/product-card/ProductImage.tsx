import Image from 'next/image';
import type { FC } from 'react';

import Placeholder from '@/components/shared/Placeholder';

interface ProductImageProps {
  imageSrc: string;
  alt: string;
}

const ProductImage: FC<ProductImageProps> = ({ imageSrc, alt }) => {
  return (
    <div className="relative mb-3 size-40">
      {imageSrc ? (
        <Image
          fill
          sizes="(min-width: 300px) 66vw, 100vw"
          src={imageSrc}
          alt={alt}
          className="size-40 shrink-0 object-cover"
        />
      ) : (
        <Placeholder />
      )}
    </div>
  );
};

export default ProductImage;
