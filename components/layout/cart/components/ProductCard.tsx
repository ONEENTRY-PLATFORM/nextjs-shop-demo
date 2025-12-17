import Link from 'next/link';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
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
 * Product card component that displays a product in the shopping cart
 * Shows product image, title, price and provides controls for quantity and selection
 * Wrapped with animation component for staggered entrance effects
 * @param   {object}           props          - Product card props
 * @param   {IProductsEntity}  props.product  - Product entity object containing product data
 * @param   {boolean}          props.selected - Indicates if the product is currently selected
 * @param   {string}           props.lang     - Current language shortcode for price formatting
 * @param   {number}           props.index    - Index of element in array for staggered animation timing
 * @param   {IAttributeValues} props.dict     - Dictionary for translations
 * @returns {JSX.Element}                     Product card with animations
 */
const ProductCard = ({
  product,
  selected,
  lang,
  index,
  dict,
}: {
  product: IProductsEntity;
  selected: boolean;
  lang: string;
  index: number;
  dict: IAttributeValues;
}): JSX.Element => {
  /* Redux dispatch function for updating state */
  const dispatch = useAppDispatch();

  /* Extract data from product object for easier access */
  const {
    id,
    attributeValues: { pic, price, sale, units_product },
    localizeInfos,
    statusIdentifier,
  } = product;

  /* Get product title from localized information */
  const title = localizeInfos?.title;

  /* Extract localized text for out of stock */
  const { out_of_stock_button } = dict;

  /* Check if product is out of stock */
  const isOutOfStock =
    statusIdentifier !== 'in_stock' || (units_product?.value ?? 0) < 1;

  /**
   * Handle checkbox toggle to select/deselect product in the cart
   * When checked, it means the user wants to include the product in the order
   * When unchecked, it means the user wants to exclude the product from the order
   * Disabled when product is out of stock
   */
  const handleCheckboxChange = () => {
    /* Only allow toggling if product is in stock */
    if (!isOutOfStock) {
      /* Dispatch action to toggle product selection state in Redux store */
      dispatch(deselectProduct(id));
    }
  };

  return (
    /** Wrap product card with animation component for staggered entrance effects */
    <ProductAnimations
      className="product-in-cart"
      product={product}
      index={index}
    >
      {/** Product information section */}
      <div className="relative flex justify-between gap-5">
        {/** Checkbox for product selection */}
        <div className="relative z-10 mb-auto box-border flex shrink-0 flex-row self-center overflow-hidden rounded-md">
          <input
            onChange={handleCheckboxChange}
            type="checkbox"
            name={'deselectProduct-' + id}
            id={'deselectProduct-' + id}
            checked={!isOutOfStock && selected}
            disabled={isOutOfStock}
            className={`size-5 border-spacing-3 accent-orange-500 ring-2 ring-orange-700 ${isOutOfStock ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            aria-label={
              isOutOfStock
                ? `Product ${title} is out of stock`
                : selected
                  ? `Deselect product ${title}`
                  : `Select product ${title}`
            }
          />
        </div>

        {/** Product image */}
        <div className="relative h-37.5 w-32.5 shrink-0 rounded-xl bg-slate-50">
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

        {/** Product details: title and price */}
        <div className="flex flex-col gap-5 self-start text-neutral-600">
          {/** Product title */}
          <h2 className="text-base leading-8">{title}</h2>

          {/** Price display with sale price if applicable */}
          <PriceDisplay
            currentPrice={sale?.value}
            originalPrice={price?.value}
            lang={lang}
          />
        </div>

        {/** Link to product details page */}
        <Link
          href={`/shop/product/` + id}
          className="absolute left-0 top-0 z-0 flex size-full"
          aria-label={`${title}`}
        ></Link>
      </div>

      {/** Product controls: quantity selector and delete button */}
      <div className="z-10 flex items-center gap-5 self-start text-xl font-bold leading-8 text-neutral-600 max-sm:ml-8 max-sm:flex">
        {/** Show out of stock message or quantity selector based on availability */}
        {isOutOfStock ? (
          <div className="flex h-10.5 items-center rounded-3xl bg-slate-100 px-5 text-base font-medium text-gray-500">
            {out_of_stock_button?.value || 'Out of stock'}
          </div>
        ) : (
          /** Component for selecting product quantity */
          <QuantitySelector
            id={id}
            units={units_product?.value}
            title={title}
            height={42}
          />
        )}

        {/** Button to remove product from cart */}
        <DeleteButton productId={id} dict={dict} />
      </div>
    </ProductAnimations>
  );
};

export default memo(ProductCard);
