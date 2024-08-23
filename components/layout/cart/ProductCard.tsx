import Image from 'next/image';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { useAppDispatch } from '@/app/store/hooks';
import { deselectProduct } from '@/app/store/reducers/CartSlice';

import QuantitySelector from '../product/components/QuantitySelector';
import DeleteButton from './DeleteButton';

const ProductCard: React.FC<{
  product: IProductsEntity;
}> = ({ product }) => {
  const dispatch = useAppDispatch();

  if (!product) {
    return;
  }

  const { id, attributeValues, price, localizeInfos } = product;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  return (
    <article className="flex w-full justify-between gap-5 border border-solid border-neutral-100 bg-white max-md:flex-wrap max-sm:flex max-sm:flex-row">
      <div className="flex justify-between gap-5">
        <div className="relative mb-auto box-border flex shrink-0 flex-row self-center">
          <input
            onChange={(e) => {
              dispatch(deselectProduct(id));
            }}
            type="checkbox"
            name={'deselectProduct-' + id}
            id=""
            checked
          />
        </div>

        <div className="relative h-[150px] w-[130px] shrink-0 rounded-xl bg-slate-300">
          <Image
            fill
            loading="lazy"
            src={attributeValues.pic?.value.downloadLink}
            alt={localizeInfos?.title}
            className="aspect-square size-full shrink-0 self-start object-cover"
          />
        </div>

        <div className="flex flex-col gap-5 self-start text-neutral-600">
          <h2 className="text-base leading-8">{localizeInfos?.title}</h2>
          <p className="text-xl font-bold leading-8">{formattedPrice}</p>
        </div>
      </div>

      <div className="flex items-center gap-5 self-start text-xl font-bold leading-8 text-neutral-600 max-sm:flex max-sm:flex-row">
        <QuantitySelector product={product} />
        <DeleteButton {...product} />
      </div>
    </article>
  );
};

export default ProductCard;
