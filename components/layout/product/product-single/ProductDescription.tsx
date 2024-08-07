import VariationsCarousel from '../variations/VariationsCarousel';

interface ProductDescriptionProps {
  description: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
}) => {
  return (
    <div className="flex w-4/12 grow flex-col max-md:mt-10 max-md:w-full">
      <div className="relative mb-6 box-border flex shrink-0 flex-col">
        <VariationsCarousel />
      </div>
      <p className="text-sm leading-5 text-neutral-600">{description}</p>
    </div>
  );
};

export default ProductDescription;
