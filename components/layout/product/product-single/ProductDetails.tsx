import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import AddToCartButton from '../components/AddToCartButton';
import PriceDisplay from '../components/PriceDisplay';
import ProductUnits from './ProductUnits';

const ProductDetails: FC<IProductsEntity & { productPages?: [] }> = async (
  product,
) => {
  const { attributeValues, localizeInfos } = product;
  const units = attributeValues?.units_product.value;

  return (
    <div className="flex w-3/12 flex-col pt-1.5 max-md:mb-10 max-md:w-full">
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
        />
      </div>

      <ProductUnits units={units} />

      <AddToCartButton
        product={product}
        height={50}
        className="btn btn-lg btn-primary"
      />
    </div>
  );
};

export default ProductDetails;
