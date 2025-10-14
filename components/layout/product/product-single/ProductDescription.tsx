/* eslint-disable jsdoc/check-param-names */
import parse from 'html-react-parser';
import type { JSX } from 'react';

/**
 * Product description component.
 * Displays the product description with HTML formatting support.
 * Handles cases where description may be missing or empty.
 * Parses HTML content for proper rendering in the UI.
 * @param   {object}        props                                     - Component properties.
 * @param   {object}        props.description                         - Product description object containing formatted text.
 * @param   {Array<object>} props.description.value                   - Array of product description objects.
 * @param   {string}        props.description.value[index].htmlValue  - Product description in HTML format.
 * @param   {string}        props.description.value[index].plainValue - Product description in plain text format.
 * @returns {JSX.Element}                                             Product description.
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
  /** Return empty element if no description is provided */
  if (!description) {
    return <></>;
  }

  /** Extract description values from the description object */
  const val = description.value;

  /** Get HTML or plain text description, prioritizing HTML format */
  const descript = val[0]?.htmlValue || val[0]?.plainValue;

  return (
    <div className="text-sm leading-5 text-neutral-600">
      {descript && parse(descript)}
    </div>
  );
};

export default ProductDescription;
