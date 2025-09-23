import Link from 'next/link';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import AddToCartButton from '../components/AddToCartButton';
import PriceDisplay from '../components/PriceDisplay';
import ProductUnits from './ProductUnits';

interface ProductDetailsProps {
  product: IProductsEntity & { productPages?: [] };
  lang: string;
  dict: IAttributeValues;
}

/**
 * Product details
 *
 * @param product product entity object
 * @param lang current language shortcode
 * @param dict dictionary from server api
 *
 * @returns Product details
 */
const ProductDetails: FC<ProductDetailsProps> = async ({
  product,
  lang,
  dict,
}) => {
  // Extract data from product
  const {
    id,
    statusIdentifier,
    localizeInfos: { title },
    attributeValues: { sale, price, units_product },
  } = product;
  const units = units_product?.value;

  return (
    <>
      <h1 className="text-xl leading-6 text-neutral-600">{title}</h1>

      {/* !!! category */}
      <p className="mt-3 text-sm leading-4 text-neutral-600">
        <Link
          prefetch={true}
          href={
            '/shop/category/' + product.attributeValues.category?.value.value
          }
        >
          {product.attributeValues.category?.value.title}
        </Link>
      </p>
      {/* !!! category */}

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
        productTitle={title || ''}
        dict={dict}
        height={50}
        className="btn btn-lg btn-primary"
      />
    </>
  );
};

export default ProductDetails;
