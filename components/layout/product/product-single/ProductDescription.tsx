import parse from 'html-react-parser';
import type { JSX } from 'react';

/**
 * Product description.
 *
 * @param props - Product description props.
 * @param props.description - Product description object.
 * @param props.description.value - Product description.
 * @param props.description.value[index].htmlValue - Product description (HTML).
 * @param props.description.value[index].plainValue - Product description (plain text).
 *
 * @returns Product description.
 */
const ProductDescription = ({
  description,
}: {
  description: {
    value: {
      htmlValue: string;
      plainValue: string;
    }[];
  };
}): JSX.Element => {
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
