'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';
import { useContext, useEffect, useState } from 'react';

import { api, useGetProductsByIdsQuery } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import {
  addDeliveryToCart,
  addProductsToCart,
  selectCartData,
} from '@/app/store/reducers/CartSlice';
import type { IProducts } from '@/app/types/global';
import CartAnimations from '@/components/layout/cart/animations/CartAnimations';
import EmptyCart from '@/components/layout/cart/components/EmptyCart';
import ProductCard from '@/components/layout/cart/components/ProductCard';
import Loader from '@/components/shared/Loader';

import DeliveryForm from './delivery-table/DeliveryForm';

/**
 * Cart page component for displaying and managing shopping cart items.
 * Fetches product data, handles real-time updates via WebSocket, and renders cart contents.
 * @param   {object}           props              - Cart page props.
 * @param   {string}           props.lang         - Current language shortcode.
 * @param   {IAttributeValues} props.dict         - Dictionary from server API.
 * @param   {IProductsEntity}  props.deliveryData - Represents a product entity object.
 * @returns {JSX.Element}                         Cart page component.
 */
const CartPage = ({
  lang,
  dict,
  deliveryData,
}: {
  lang: string;
  dict: IAttributeValues;
  deliveryData: IProductsEntity;
}): JSX.Element => {
  /**
   * Initialize Redux dispatch function for updating store
   */
  const dispatch = useAppDispatch();

  /**
   * Get authentication status from context to enable WebSocket connection
   */
  const { isAuth } = useContext(AuthContext);

  /**
   * State to store real-time WebSocket updates for products
   * Maps product ID to updated fields
   */
  const [updatedProducts, setUpdatedProducts] = useState<
    Record<number, Partial<IProductsEntity>>
  >({});

  /**
   * Get products data from Redux cart slice
   * Contains product IDs and selected status for items in the cart
   */
  const productsCartData = useAppSelector(selectCartData) as IProducts[];

  /**
   * Fetch products by IDs using RTK Query
   * Retrieves full product information for items in the cart
   */
  const { data, isLoading } = useGetProductsByIdsQuery({
    items: productsCartData.map((p) => p.id.toString()).toString(),
  });

  /**
   * Merge API data with real-time WebSocket updates
   */
  const products = data?.map((product) => ({
    ...product,
    ...updatedProducts[product.id],
  }));

  /**
   * Effect hook to add delivery data to the cart
   * Runs when deliveryData prop changes
   */
  useEffect(() => {
    if (deliveryData) {
      dispatch(addDeliveryToCart(deliveryData));
    }
  }, [deliveryData, dispatch]);

  /**
   * Effect hook to add products to Redux cart when data is fetched
   */
  useEffect(() => {
    if (data) {
      dispatch(addProductsToCart(data));
    }
  }, [data, dispatch]);

  /**
   * Effect hook to handle WebSocket connection for real-time updates
   * Sets up listener for product changes when user is authenticated
   */
  useEffect(() => {
    if (!isAuth || !data?.length) {
      return;
    }

    /**
     * Connect to WebSocket if authenticated
     * Enables real-time updates for product information
     */
    const ws = api.WS.connect();
    if (!ws) {
      return;
    }

    ws.on('notification', async (res) => {
      if (res?.product) {
        const product = {
          ...res.product,
          attributeValues: res.product?.attributes,
        };

        const newPrice = parseInt(product?.attributeValues?.price?.value, 10);

        /**
         * Update product price and status on receiving a notification
         * Store updates in a map to be merged with API data
         */
        setUpdatedProducts((prev) => ({
          ...prev,
          [product.id]: {
            price: newPrice,
            statusIdentifier: res?.product?.status?.identifier,
          },
        }));
      }
    });

    /**
     * Cleanup function to disconnect WebSocket on unmount
     */
    return () => {
      ws.disconnect();
    };
  }, [isAuth, data]);

  return (
    /**
     * Wrapper for cart animations
     * Provides entrance animations for the cart content
     */
    <CartAnimations className={'w-182.5 max-w-full'} index={0}>
      <div className="cart">
        <div className="cart__container flex flex-col gap-4">
          <div className="cart__products flex flex-col gap-4">
            {
              /**
               * Conditional rendering based on loading state and product availability
               * Shows loader while fetching, product cards when available, or empty cart message
               */
              isLoading ? (
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
              )
            }
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
