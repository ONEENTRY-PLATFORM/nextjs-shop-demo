import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';
import { memo } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { deselectProduct } from '@/app/store/reducers/CartSlice';
import OptimizedImage from '@/components/shared/OptimizedImage';

import QuantitySelector from '../../product/components/QuantitySelector';
import ProductAnimations from '../animations/ProductAnimations';
import DeleteButton from './DeleteButton';
import PriceDisplay from './PriceDisplay';

/**
 * Product card in cart.
 * @param   {object}          props          - Product card props.
 * @param   {IProductsEntity} props.product  - product entity object.
 * @param   {boolean}         props.selected - product selected.
 * @param   {string}          props.lang     - Current language shortcode.
 * @param   {number}          props.index    - index of element in array for stagger.
 * @returns {JSX.Element}                    ProductCard with animations.
 */
const ProductCard = ({
  product,
  selected,
  lang,
  index,
}: {
  product: IProductsEntity;
  selected: boolean;
  lang: string;
  index: number;
}): JSX.Element => {
  const dispatch = useAppDispatch();
  // extract data from product
  const {
    id,
    attributeValues: { pic, price, sale, units_product },
    localizeInfos,
  } = product;

  const title = localizeInfos?.title;
  // Handle checkbox toggle: when checked, it means the user wants to select the product
  const handleCheckboxChange = () => {
    // Regardless of checkbox state, toggle the product selection
    dispatch(deselectProduct(id));
  };

  return (
    <ProductAnimations
      className="product-in-cart"
      product={product}
      index={index}
    >
      <div className="relative flex justify-between gap-5">
        <div className="relative z-10 mb-auto box-border flex shrink-0 flex-row self-center overflow-hidden rounded-md">
          <input
            onChange={handleCheckboxChange}
            type="checkbox"
            name={'deselectProduct-' + id}
            id={'deselectProduct-' + id}
            checked={selected}
            className="size-5 border-spacing-3 accent-orange-500 ring-2 ring-orange-700"
            aria-label={`Deselect product ${title}`}
          />
        </div>

        <div className="relative h-[150px] w-[130px] shrink-0 rounded-xl bg-slate-50">
          <OptimizedImage
            width={130}
            height={150}
            loading="lazy"
            src={pic}
            alt={title}
            quality={75}
            className="size-full shrink-0 self-start object-cover"
          />
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
          href={`/shop/product/` + id}
          className="absolute left-0 top-0 z-0 flex size-full"
          aria-label={`${title}`}
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

export default memo(ProductCard);
