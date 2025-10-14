import Link from 'next/link';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import {
  getProductCategory,
  getProductTitle,
} from '@/app/api/hooks/useProductsData';

import AddToCartButton from '../components/AddToCartButton';
import PriceDisplay from '../components/PriceDisplay';
import ProductUnits from './ProductUnits';

/**
 * Product details component.
 * Displays comprehensive product information including title, category, price, availability and add to cart functionality.
 * Uses utility functions to safely extract product data and handles localization.
 * Integrates with other components like PriceDisplay, ProductUnits, and AddToCartButton.
 * @param   {object}           props         - Component properties.
 * @param   {IProductsEntity}  props.product - Product entity object containing all product information.
 * @param   {string}           props.lang    - Current language shortcode for localization.
 * @param   {IAttributeValues} props.dict    - Dictionary from server API containing localized text values.
 * @returns {JSX.Element}                    Product details component.
 */
const ProductDetails = ({
  product,
  lang,
  dict,
}: {
  product: IProductsEntity;
  lang: string;
  dict: IAttributeValues;
}): JSX.Element => {
  /** Extract data using safe utility functions */
  const title = getProductTitle(product) || '';
  const category = getProductCategory(product);

  /** Extract other data from product */
  const {
    id,
    statusIdentifier,
    attributeValues: { sale, price, units_product },
  } = product;
  const units = units_product?.value || 0;

  return (
    <>
      <h1 className="text-xl leading-6 text-neutral-600">{title}</h1>

      {/** Category */}
      {category && (
        <p className="mt-3 text-sm leading-4 text-neutral-600">
          <Link href={'/shop/category/' + category.value}>
            {category.title}
          </Link>
        </p>
      )}

      <div className="mb-5 mt-4 text-left text-xl font-bold leading-8 text-neutral-600">
        <PriceDisplay
          currentPrice={sale?.value}
          originalPrice={price?.value}
          lang={lang}
        />
      </div>

      <ProductUnits units={units} />

      <AddToCartButton
        id={id}
        units={units}
        statusIdentifier={statusIdentifier || ''}
        productTitle={title}
        dict={dict}
        height={50}
        className="btn btn-lg btn-primary"
      />
    </>
  );
};

export default ProductDetails;
