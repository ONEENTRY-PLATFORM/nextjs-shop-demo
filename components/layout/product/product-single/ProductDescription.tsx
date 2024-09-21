import parse from 'html-react-parser';

interface ProductDescriptionProps {
  description: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
}) => {
  return (
    <div className="text-sm leading-5 text-neutral-600">
      {parse(description)}
    </div>
  );
};

export default ProductDescription;
