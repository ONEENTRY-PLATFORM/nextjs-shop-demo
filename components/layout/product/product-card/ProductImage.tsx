import Image from 'next/image';

interface ProductImageProps {
  imageSrc: string;
  alt: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ imageSrc, alt }) => {
  return (
    <div className="relative size-40">
      <Image
        fill
        src={imageSrc}
        alt={alt}
        className="size-40 shrink-0 object-cover"
      />
    </div>
  );
};

export default ProductImage;
