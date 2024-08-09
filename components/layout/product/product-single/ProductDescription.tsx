interface ProductDescriptionProps {
  description: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
}) => {
  return <p className="text-sm leading-5 text-neutral-600">{description}</p>;
};

export default ProductDescription;
