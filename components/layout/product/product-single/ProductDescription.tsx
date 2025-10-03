import parse from 'html-react-parser';
import type { JSX } from 'react';

interface ProductDescriptionProps {
  description: {
    value: {
      htmlValue: string;
      plainValue: string;
    }[];
  };
}

/**
 * Product description.
 *
 * @param description - Product description.
 *
 * @returns Product description.
 */
const ProductDescription = ({
  description,
}: ProductDescriptionProps): JSX.Element => {
  if (!description) {
    return <></>;
  }

  const val = description.value;
  const descript = val[0]?.htmlValue || val[0]?.plainValue;

  return (
    <div className="text-sm leading-5 text-neutral-600">
      {descript && parse(descript)}
    </div>
  );
};

export default ProductDescription;
