import Link from 'next/link';
import type { IAttributeValues, IProductsEntity } from 'oneentry/types';
import type { JSX } from 'react';

import {
  getProductCategory,
  getProductTitle,
} from '@/app/api/hooks/useProductsData';
import { NO_TITLE } from '@/app/utils/constants';

import AddToCartButton from '../components/AddToCartButton';
import PriceDisplay from '../components/PriceDisplay';
import ProductUnits from './ProductUnits';

/**
 * Product details component.
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
  const title = getProductTitle(product, NO_TITLE);
  const category = getProductCategory(product);

  /**
   * Extract other data from product. `attributeValues` is optional CMS
   * content — a product can exist with no attribute record at all, so the map
   * is defaulted before destructuring instead of throwing on `undefined`.
   */
  const { id, statusIdentifier } = product;
  const { sale, price, units_product } = product.attributeValues ?? {};

  /**
   * Available units — integer attributes come back as `number | null`
   * (unfilled = null since SDK 1.0.157) and the attribute itself may be
   * absent, so normalize to 0 instead of feeding null/undefined into
   * arithmetic and stock checks.
   */
  const units = (units_product?.value as number | null | undefined) ?? 0;

  /** Hide the units progress bar entirely when the attribute is not filled */
  const hasUnits = units_product?.value != null;

  return (
    <>
      <h1
        className="text-xl leading-6 text-neutral-600"
        data-testid="product-title"
      >
        {title}
      </h1>

      {/** Category */}
      {category && (
        <p className="mt-3 text-sm leading-4 text-neutral-600">
          <Link href={'/shop/category/' + category.value}>
            {category.title}
          </Link>
        </p>
      )}

      <div
        className="mt-4 mb-5 text-left text-xl leading-8 font-bold text-neutral-600"
        data-testid="product-price"
      >
        <PriceDisplay
          currentPrice={sale?.value as number}
          originalPrice={price?.value as number}
          lang={lang}
        />
      </div>

      {hasUnits && <ProductUnits units={units} />}

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
