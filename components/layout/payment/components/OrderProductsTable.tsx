import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { type FC } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import {
  selectCartData,
  selectCartItems,
} from '@/app/store/reducers/CartSlice';
import { UsePrice } from '@/components/utils/utils';

type OrderProductsTableProps = {
  lang: string;
  products: IProductsEntity[] | undefined;
  delivery: IProductsEntity | undefined;
};

/**
 * Order products table
 *
 * @param lang current language shortcode
 * @param products Products data
 * @param delivery Delivery data
 *
 * @returns JSX.Element
 */
const OrderProductsTable: FC<OrderProductsTableProps> = ({
  lang,
  products,
  delivery,
}) => {
  const productsDataInCart = useAppSelector(selectCartData) as Array<{
    id: number;
    quantity: number;
    selected: boolean;
  }>;
  const productsInCart = useAppSelector(
    selectCartItems,
  ) as Array<IProductsEntity>;
  const d = useAppSelector((state) => state.cartReducer.delivery);

  // Use passed products or fallback to Redux state
  const actualProducts = products || productsInCart;
  const actualProductsData = productsDataInCart;

  // Check if we have data to display
  const hasProducts =
    actualProductsData && actualProductsData.some((item) => item.selected);
  const hasDelivery = delivery || d;

  if (!hasProducts && !hasDelivery) {
    return <div className="p-4">No products or delivery information</div>;
  }

  return (
    <>
      {/* head row */}
      <div className="flex border-b border-solid border-[#B0BCCE] p-2">
        <div className="w-1/2 font-bold">Product</div>
        <div className="w-1/4 font-bold">Price</div>
        <div className="w-1/4 font-bold">Quantity</div>
      </div>

      {/* products row */}
      {actualProductsData.map((product, i) => {
        // Find the actual product by ID
        const actualProduct = actualProducts.find((p) => p.id === product.id);
        if (!actualProduct || !product.selected) {
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

      {/* delivery row */}
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
