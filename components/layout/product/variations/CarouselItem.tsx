import Image from 'next/image';

interface VariationProps {
  title: string;
  imageSrc: string;
}

const CarouselItem: React.FC<VariationProps> = ({ title, imageSrc }) => {
  return (
    <div className="relative box-border flex w-20 shrink-0 flex-col">
      <article className="flex max-w-[80px] flex-col gap-2 whitespace-nowrap text-center text-sm text-slate-300">
        <div className="min-h-[93px] w-full bg-neutral-100">
          <Image
            fill
            sizes="(min-width: 300px) 66vw, 100vw"
            src={imageSrc}
            alt="Product"
            className="size-full shrink-0 rounded-xl object-cover"
          />
        </div>
        <h3 className="w-full leading-4">{title}</h3>
      </article>
    </div>
  );
};

export default CarouselItem;
