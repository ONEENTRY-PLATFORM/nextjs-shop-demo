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
 * Product card component that displays a product in the shopping cart
 * Shows product image, title, price and provides controls for quantity and selection
 * Wrapped with animation component for staggered entrance effects
 * @param   {object}          props          - Product card props
 * @param   {IProductsEntity} props.product  - Product entity object containing product data
 * @param   {boolean}         props.selected - Indicates if the product is currently selected
 * @param   {string}          props.lang     - Current language shortcode for price formatting
 * @param   {number}          props.index    - Index of element in array for staggered animation timing
 * @returns {JSX.Element}                    Product card with animations
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
  /** Redux dispatch function for updating state */
  const dispatch = useAppDispatch();

  /** Extract data from product object for easier access */
  const {
    id,
    attributeValues: { pic, price, sale, units_product },
    localizeInfos,
  } = product;

  /** Get product title from localized information */
  const title = localizeInfos?.title;

  /**
   * Handle checkbox toggle to select/deselect product in the cart
   * When checked, it means the user wants to include the product in the order
   * When unchecked, it means the user wants to exclude the product from the order
   */
  const handleCheckboxChange = () => {
    /** Dispatch action to toggle product selection state in Redux store */
    dispatch(deselectProduct(id));
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
            checked={selected}
            className="size-5 border-spacing-3 accent-orange-500 ring-2 ring-orange-700 cursor-pointer"
            aria-label={
              selected ? `Deselect product ${title}` : `Select product ${title}`
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
        {/** Component for selecting product quantity */}
        <QuantitySelector
          id={id}
          units={units_product?.value}
          title={title}
          height={42}
        />

        {/** Button to remove product from cart */}
        <DeleteButton productId={id} />
      </div>
    </ProductAnimations>
  );
};

export default memo(ProductCard);
