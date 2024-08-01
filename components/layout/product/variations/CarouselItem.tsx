import VariationCard from './VariationCard';

interface VariationProps {
  title: string;
  imageSrc: string;
}

const CarouselItem: React.FC<VariationProps> = ({ title, imageSrc }) => {
  return (
    <div className="relative box-border flex w-20 shrink-0 flex-col">
      <VariationCard title={title} imageSrc={imageSrc} />
    </div>
  );
};

export default CarouselItem;
