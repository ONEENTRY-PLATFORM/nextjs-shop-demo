import Image from 'next/image';

interface VariationProps {
  title: string;
  imageSrc: string;
}

const CarouselItem: React.FC<VariationProps> = ({ title, imageSrc }) => {
  return (
    <div className="relative box-border flex w-20 shrink-0 flex-col">
      <div className="flex max-w-[80px] flex-col gap-1 overflow-hidden whitespace-nowrap text-center text-sm text-slate-300">
        <div className="h-[80px] w-full bg-neutral-100">
          <Image
            width={80}
            height={80}
            src={imageSrc}
            alt="Product"
            className="size-full shrink-0 rounded-lg object-cover"
          />
        </div>
        <h3 className="w-full text-center leading-4">{title}</h3>
      </div>
    </div>
  );
};

export default CarouselItem;
