import Image from 'next/image';

interface VariationCardProps {
  title: string;
  imageSrc: string;
}

const VariationCard: React.FC<VariationCardProps> = ({ title, imageSrc }) => {
  return (
    <article className="flex max-w-[80px] flex-col gap-2 whitespace-nowrap text-center text-sm text-slate-300">
      <div className="min-h-[93px] w-full bg-neutral-100">
        <Image
          fill
          src={imageSrc}
          alt="Product"
          className="size-full shrink-0 rounded-xl object-cover"
        />
      </div>
      <h3 className="w-full leading-4">{title}</h3>
    </article>
  );
};

export default VariationCard;
