import Image from 'next/image';
import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { useAppDispatch } from '@/app/store/hooks';
import { deselectProduct } from '@/app/store/reducers/CartSlice';

// import { UsePrice } from '@/components/utils';
import QuantitySelector from '../product/components/QuantitySelector';
import DeleteButton from './DeleteButton';
import PriceDisplay from './PriceDisplay';

const ProductCard: React.FC<{
  product: IProductsEntity & { selected: boolean };
}> = ({ product }) => {
  const dispatch = useAppDispatch();

  if (!product) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, attributeValues, price, localizeInfos, selected } = product;

  return (
    <article className="flex w-full justify-between gap-5 bg-white max-md:flex-wrap max-sm:flex max-sm:flex-row">
      <div className="relative flex justify-between gap-5">
        <div className="relative z-10 mb-auto box-border flex shrink-0 flex-row self-center">
          <input
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onChange={(e) => {
              dispatch(deselectProduct(id));
            }}
            type="checkbox"
            name={'deselectProduct-' + id}
            id=""
            checked={selected}
          />
        </div>

        <div className="relative h-[150px] w-[130px] shrink-0 rounded-xl bg-slate-300">
          <Image
            width={130}
            height={150}
            loading="lazy"
            src={attributeValues.pic?.value.downloadLink}
            alt={localizeInfos?.title}
            className="aspect-square size-full shrink-0 self-start object-cover"
          />
        </div>

        <div className="flex flex-col gap-5 self-start text-neutral-600">
          <h2 className="text-base leading-8">{localizeInfos?.title}</h2>
          <PriceDisplay
            currentPrice={attributeValues.sale?.value}
            originalPrice={attributeValues.price?.value}
          />
        </div>

        <Link
          href={`/shop/product/` + id}
          className="absolute left-0 top-0 z-0 flex size-full"
        ></Link>
      </div>

      <div className="z-10 flex items-center gap-5 self-start text-xl font-bold leading-8 text-neutral-600 max-sm:ml-6 max-sm:flex">
        <QuantitySelector product={product} height={42} />
        <DeleteButton {...product} />
      </div>
    </article>
  );
};

export default ProductCard;
