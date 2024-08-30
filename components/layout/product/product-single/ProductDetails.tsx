import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { UsePrice } from '../../../utils';
import AddToCartButton from '../components/AddToCartButton';

const ProductDetails: React.FC<IProductsEntity> = (product) => {
  const { attributeValues, localizeInfos, price } = product;
  const fPrice = UsePrice({ amount: price, currency: 'USD' });
  const units = attributeValues?.units_product.value;
  const maxUnits = 50;
  const width = (units / maxUnits) * 100;

  return (
    <div className="flex w-3/12 flex-col pt-1.5 max-md:mb-10 max-md:w-full">
      <h1 className="text-xl leading-6 text-neutral-600">
        {localizeInfos?.title}
      </h1>

      <p className="mt-3 text-sm leading-4 text-neutral-600">
        <Link
          href={
            '/shop/category/' + product.attributeValues.category.value.value
          }
        >
          {product.attributeValues.category.value.title}
        </Link>
      </p>

      <p className="mb-5 mt-4 text-left text-xl font-bold leading-8 text-neutral-600">
        {fPrice}
      </p>

      <div className="relative mb-6 box-border flex shrink-0 flex-col ">
        <div className="self-end text-sm text-slate-300">{units} units</div>
        <div className="z-10 mt-1.5 flex w-full flex-row justify-start rounded-xl bg-zinc-300">
          <div
            className={'mr-auto h-[3px] shrink-0 rounded-xl bg-orange-500'}
            style={{
              width: width + '%',
            }}
          />
        </div>
      </div>

      <AddToCartButton
        product={product}
        height={50}
        className="rounded-[30px] border border-solid border-orange-500 bg-orange-500 px-5 py-4 text-center text-base font-bold uppercase text-white max-md:px-5"
      />
    </div>
  );
};

export default ProductDetails;
