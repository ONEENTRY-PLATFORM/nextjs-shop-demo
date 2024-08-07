import Image from 'next/image';

interface ProductImageProps {
  imageSrc: string;
  alt: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ imageSrc, alt }) => {
  return (
    <div className="relative mb-10 flex h-[280px] w-[30%] grow flex-col max-md:mb-8 max-md:w-full max-md:max-w-[48%] max-sm:mb-8 max-sm:w-full max-sm:max-w-full">
      <Image
        fill
        src={imageSrc}
        alt={alt}
        className="size-full shrink-0 bg-slate-300 object-cover"
      />
    </div>
  );
};

export default ProductImage;
