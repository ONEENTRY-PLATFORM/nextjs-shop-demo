import parse from 'html-react-parser';

interface ProductDescriptionProps {
  description: {
    value: {
      htmlValue: string;
      plainValue: string;
    }[];
  };
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
}) => {
  const descript =
    description.value[0]?.htmlValue || description?.value[0]?.plainValue;
  return (
    <div className="text-sm leading-5 text-neutral-600">
      {descript && parse(descript)}
    </div>
  );
};

export default ProductDescription;
