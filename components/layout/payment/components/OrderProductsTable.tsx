import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import {
  selectCartData,
  selectCartItems,
} from '@/app/store/reducers/CartSlice';
import { UsePrice } from '@/components/utils/utils';

/**
 * Order products table component.
 * Displays a table of products in the cart with their prices and quantities.
 * Also shows delivery information if available.
 * Retrieves product data from Redux store or uses passed props.
 * Handles cases where there are no products or delivery information to display.
 * @param   {object}                        props          - Component properties.
 * @param   {string}                        props.lang     - Current language shortcode for price formatting.
 * @param   {IProductsEntity[] | undefined} props.products - Products data to display (optional, falls back to Redux state).
 * @param   {IProductsEntity | undefined}   props.delivery - Delivery data to display (optional, falls back to Redux state).
 * @returns {JSX.Element}                                  Order products table component.
 */
const OrderProductsTable = ({
  lang,
  products,
  delivery,
}: {
  lang: string;
  products: IProductsEntity[] | undefined;
  delivery: IProductsEntity | undefined;
}): JSX.Element => {
  /** Retrieve cart data from Redux store */
  const productsDataInCart = useAppSelector(selectCartData) as Array<{
    id: number;
    quantity: number;
    selected: boolean;
  }>;

  /** Retrieve products in cart from Redux store */
  const productsInCart = useAppSelector(
    selectCartItems,
  ) as Array<IProductsEntity>;

  /** Retrieve delivery information from Redux store */
  const d = useAppSelector((state) => state.cartReducer.delivery);

  /** Use passed products or fallback to Redux state */
  const actualProducts = products || productsInCart;
  const actualProductsData = productsDataInCart;

  /** Check if we have data to display */
  const hasProducts =
    actualProductsData && actualProductsData.some((item) => item.selected);
  const hasDelivery = delivery || d;

  if (!hasProducts && !hasDelivery) {
    return <div className="p-4">No products or delivery information</div>;
  }

  return (
    <>
      {/** Table header row */}
      <div className="flex border-b border-solid border-[#B0BCCE] p-2">
        <div className="w-1/2 font-bold">Product</div>
        <div className="w-1/4 font-bold">Price</div>
        <div className="w-1/4 font-bold">Quantity</div>
      </div>

      {/** Product rows */}
      {actualProductsData.map((product, i) => {
        /** Find the actual product by ID */
        const actualProduct = actualProducts.find((p) => p.id === product.id);
        if (!actualProduct || !product.selected) {
          return null;
        }

        /** Check if product is in stock */
        const isInStock =
          actualProduct.statusIdentifier === 'in_stock' &&
          (actualProduct.attributeValues?.units_product?.value ?? 0) >= 1;

        /** Don't show out of stock products in order */
        if (!isInStock) {
          return null;
        }

        const { quantity } = product;
        const { localizeInfos, price, attributeValues } = actualProduct;

        return (
          <div
            key={i}
            className="-mt-px flex border-b border-solid border-[#B0BCCE] p-2"
          >
            <div className="w-1/2">{localizeInfos?.title}</div>
            <div className="w-1/4">
              {UsePrice({
                amount:
                  attributeValues?.sale?.value ||
                  attributeValues?.price?.value ||
                  price ||
                  0,
                lang,
              })}
            </div>
            <div className="w-1/4">{quantity}</div>
          </div>
        );
      })}

      {/** Delivery row */}
      {hasDelivery && (
        <div className="-mt-px flex border-b border-solid border-[#B0BCCE] p-2">
          <div className="w-1/2">
            {delivery?.localizeInfos?.title ||
              d?.localizeInfos?.title ||
              'Delivery'}
          </div>
          <div className="w-1/4">
            {UsePrice({
              amount:
                delivery?.attributeValues?.price?.value ||
                delivery?.price ||
                d?.attributeValues?.price?.value ||
                d?.price ||
                0,
              lang,
            })}
          </div>
          <div className="w-1/4">1</div>
        </div>
      )}
    </>
  );
};

export default OrderProductsTable;
