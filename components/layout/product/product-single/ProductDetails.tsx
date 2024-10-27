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

const ProductDetails: FC<ProductDetailsProps> = async ({
  product,
  lang,
  dict,
}) => {
  const { attributeValues, localizeInfos } = product;
  const units = attributeValues?.units_product?.value;

  return (
    <>
      <h1 className="text-xl leading-6 text-neutral-600">
        {localizeInfos.title}
      </h1>

      {/* !!! category */}
      <p className="mt-3 text-sm leading-4 text-neutral-600">
        <Link
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
          currentPrice={attributeValues.sale?.value}
          originalPrice={attributeValues.price?.value}
          lang={lang}
        />
      </div>

      <ProductUnits units={units} />

      <AddToCartButton
        product={product}
        dict={dict}
        height={50}
        className="btn btn-lg btn-primary"
      />
    </>
  );
};

export default ProductDetails;
