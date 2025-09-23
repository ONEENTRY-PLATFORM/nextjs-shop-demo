'use client';
// Indicates that this file is a client-side component in Next.js

// Import necessary types and React functions
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { useContext, useEffect, useState } from 'react';

// Import API hooks and Redux hooks
import { api, useGetProductsByIdsQuery } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
// Import Redux actions and selectors
import {
  addDeliveryToCart,
  addProductsToCart,
  selectCartData,
} from '@/app/store/reducers/CartSlice';
// Import custom types and components
import type { IProducts } from '@/app/types/global';
import CartAnimations from '@/components/layout/cart/animations/CartAnimations';
import EmptyCart from '@/components/layout/cart/components/EmptyCart';
import ProductCard from '@/components/layout/cart/components/ProductCard';
import Loader from '@/components/shared/Loader';

import DeliveryForm from './delivery-table/DeliveryForm';

// Define the props interface for the CartPage component
interface CartPageProps {
  lang: string; // Current language shortcode
  dict: IAttributeValues; // Dictionary from server API
  deliveryData: IProductsEntity; // Represents a product entity object
}

/**
 * Cart page component
 *
 * @param lang - Current language shortcode
 * @param dict - Dictionary from server API
 * @param deliveryData - Represents a product entity object
 *
 * @returns JSX.Element representing the cart page
 */
const CartPage: FC<CartPageProps> = ({ lang, dict, deliveryData }) => {
  const dispatch = useAppDispatch(); // Initialize Redux dispatch function
  const { isAuth } = useContext(AuthContext); // Get authentication status from context
  const [products, setProducts] = useState<IProductsEntity[]>([]); // State to store products

  // Get products data from Redux cart slice
  const productsCartData = useAppSelector(selectCartData) as IProducts[];

  // Fetch products by IDs using a custom query hook
  const { data, isLoading } = useGetProductsByIdsQuery({
    items: productsCartData.map((p) => p.id.toString()).toString(),
  });

  // Add delivery data to the cart
  useEffect(() => {
    if (deliveryData) {
      dispatch(addDeliveryToCart(deliveryData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryData]);

  // Add fetched products to the cart slice
  useEffect(() => {
    if (data) {
      setProducts(data);
      dispatch(addProductsToCart(data));
      if (isAuth) {
        // Connect to WebSocket if authenticated
        const ws = api.WS.connect();
        if (ws) {
          ws.on('notification', async (res) => {
            if (res?.product) {
              const product = {
                ...res.product,
                attributeValues: res.product?.attributes,
              };

              const index = data.findIndex(
                (p: IProductsEntity) => p.id === product.id,
              );
              const newPrice = parseInt(
                product?.attributeValues?.price?.value,
                10,
              );

              // Update product price and status on receiving a notification
              setProducts((prevProducts) => {
                const newProducts = [...prevProducts];
                if (index !== -1 && prevProducts[index]) {
                  newProducts[index] = {
                    ...prevProducts[index],
                    price: newPrice,
                    statusIdentifier: res?.product?.status?.identifier,
                  };
                }
                return newProducts;
              });
            }
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isAuth]);

  return (
    <CartAnimations className={'w-[730px] max-w-full'} index={0}>
      <div className="cart">
        <div className="cart__container flex flex-col gap-4">
          <div className="cart__products flex flex-col gap-4">
            {isLoading ? (
              <Loader />
            ) : Array.isArray(products) && products.length ? (
              products.map((product, index) => {
                const cartItem = productsCartData.find(
                  (item) => item.id === product.id,
                );
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    lang={lang}
                    selected={cartItem?.selected ?? true}
                    index={index}
                  />
                );
              })
            ) : (
              <EmptyCart lang={lang} dict={dict} />
            )}
          </div>
          <div className="cart__delivery">
            <DeliveryForm lang={lang} dict={dict} deliveryData={deliveryData} />
          </div>
        </div>
      </div>
    </CartAnimations>
  );
};

export default CartPage;
