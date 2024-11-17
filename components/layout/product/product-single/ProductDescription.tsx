import parse from 'html-react-parser';
import type { FC } from 'react';

interface ProductDescriptionProps {
  description: {
    value: {
      htmlValue: string;
      plainValue: string;
    }[];
  };
}

/**
 * Product description
 * @param description
 *
 * @returns Product description
 */
const ProductDescription: FC<ProductDescriptionProps> = ({ description }) => {
  if (!description) {
    return;
  }
  const descript =
    description.value[0]?.htmlValue || description.value[0]?.plainValue;
  return (
    <div className="text-sm leading-5 text-neutral-600">
      {descript && parse(descript)}
    </div>
  );
};

export default ProductDescription;
