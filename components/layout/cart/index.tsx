/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
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

interface CartPageProps {
  lang: string;
  dict: IAttributeValues;
  deliveryData: IProductsEntity;
}

/**
 * Cart page
 * @param lang Current language shortcode
 * @param dict dictionary from server api
 * @param deliveryData Represents a product entity object.
 *
 * @returns
 */
const CartPage: FC<CartPageProps> = ({ lang, dict, deliveryData }) => {
  const dispatch = useAppDispatch();
  const { isAuth } = useContext(AuthContext);
  const [products, setProducts] = useState<IProductsEntity[]>([]);

  // products in redux carSlice
  const productsCartData = useAppSelector(selectCartData) as IProducts[];

  // Get Products By Ids from api
  const { data, isLoading } = useGetProductsByIdsQuery({
    items: productsCartData.map((p) => p.id),
  });

  // add delivery Data
  useEffect(() => {
    if (deliveryData) {
      dispatch(addDeliveryToCart(deliveryData));
    }
  }, [deliveryData]);

  // add products to cart slice
  useEffect(() => {
    if (data) {
      setProducts(data);
      if (isAuth) {
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

              setProducts((prevProducts) => {
                const newProducts = [...prevProducts];
                newProducts[index] = {
                  ...products[index],
                  price: newPrice,
                  statusIdentifier: res?.product?.status?.identifier,
                };
                return newProducts;
              });
            }
          });

          return () => {
            ws.disconnect();
          };
        }
      }
    }
  }, [data]);

  // update products in cart
  useEffect(() => {
    if (products) {
      dispatch(addProductsToCart(products));
    }
  }, [products]);

  if (isLoading) {
    return <Loader />;
  }

  if (!products || products.length < 1) {
    return <EmptyCart lang={lang} dict={dict} />;
  }

  return (
    <div className="flex w-full flex-col overflow-hidden pb-5 lg:max-w-[730px]">
      <CartAnimations className={'mb-4 flex w-full flex-col gap-4'} index={1}>
        {products.map((product: IProductsEntity, i: number) => {
          return (
            <ProductCard
              key={i}
              index={i}
              product={product}
              selected={productsCartData[i]?.selected}
              lang={lang}
            />
          );
        })}
      </CartAnimations>
      <DeliveryForm lang={lang} dict={dict} deliveryData={deliveryData} />
    </div>
  );
};

export default CartPage;
