import Image from 'next/image';
import type { FC } from 'react';

interface ProductImageProps {
  imageSrc: string;
  alt: string;
}

const ProductImage: FC<ProductImageProps> = ({ imageSrc, alt }) => {
  return (
    <div className="relative size-40">
      <Image
        fill
        sizes="(min-width: 300px) 66vw, 100vw"
        src={imageSrc}
        alt={alt}
        className="size-40 shrink-0 object-cover"
      />
    </div>
  );
};

export default ProductImage;
