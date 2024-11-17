import Image from 'next/image';
import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { deselectProduct } from '@/app/store/reducers/CartSlice';
import Placeholder from '@/components/shared/Placeholder';

import QuantitySelector from '../../product/components/QuantitySelector';
import ProductAnimations from '../animations/ProductAnimations';
import DeleteButton from './DeleteButton';
import PriceDisplay from './PriceDisplay';

interface ProductCardProps {
  product: IProductsEntity;
  selected: boolean;
  lang: string;
  index: number;
}

/**
 * Product card in cart
 * @param product product entity object.
 * @param selected product selected?
 * @param lang Current language shortcode
 * @param index index of element in array for stagger
 *
 * @returns ProductCard with animations
 */
const ProductCard: FC<ProductCardProps> = ({
  product,
  selected,
  lang,
  index,
}) => {
  const dispatch = useAppDispatch();
  // extract data from product
  const {
    id,
    attributeValues: { pic, price, sale, units_product },
    localizeInfos,
  } = product;
  const imgSrc = pic?.value.downloadLink;
  const title = localizeInfos?.title;

  return (
    <ProductAnimations
      className="product-in-cart"
      product={product}
      index={index}
    >
      <div className="relative flex justify-between gap-5">
        <div className="relative z-10 mb-auto box-border flex shrink-0 flex-row self-center overflow-hidden rounded-md">
          <input
            onChange={() => {
              dispatch(deselectProduct(id));
            }}
            type="checkbox"
            name={'deselectProduct-' + id}
            id={'deselectProduct-' + id}
            checked={selected}
            className="size-5 border-spacing-3 accent-orange-500 ring-2 ring-orange-700"
          />
        </div>

        <div className="relative h-[150px] w-[130px] shrink-0 rounded-xl bg-slate-50">
          {imgSrc ? (
            <Image
              width={130}
              height={150}
              loading="lazy"
              src={imgSrc}
              alt={title}
              className="size-full shrink-0 self-start object-cover"
            />
          ) : (
            <Placeholder />
          )}
        </div>

        <div className="flex flex-col gap-5 self-start text-neutral-600">
          <h2 className="text-base leading-8">{title}</h2>
          <PriceDisplay
            currentPrice={sale?.value}
            originalPrice={price?.value}
            lang={lang}
          />
        </div>

        <Link
          prefetch={true}
          href={`/shop/product/` + id}
          className="absolute left-0 top-0 z-0 flex size-full"
        ></Link>
      </div>
      <div className="z-10 flex items-center gap-5 self-start text-xl font-bold leading-8 text-neutral-600 max-sm:ml-8 max-sm:flex">
        <QuantitySelector
          id={id}
          units={units_product?.value}
          title={title}
          height={42}
        />
        <DeleteButton productId={id} />
      </div>
    </ProductAnimations>
  );
};

export default ProductCard;
