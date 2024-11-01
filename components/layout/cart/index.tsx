/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IOrderProductData } from 'oneentry/dist/orders/ordersInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';

import FadeTransition from '@/app/animations/FadeTransition';
import { api, useGetProductsByIdsQuery } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  addProductsToCart,
  addProductToCart,
  selectCartData,
} from '@/app/store/reducers/CartSlice';
import { addProducts, createOrder } from '@/app/store/reducers/OrderSlice';
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

const CartPage: FC<CartPageProps> = ({ lang, dict, deliveryData }) => {
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<IProductsEntity[]>([]);

  const productsInCart = useAppSelector(selectCartData) as IProducts[];

  const productsInOrder = useMemo(() => {
    return productsInCart.reduce(
      (results: Array<IOrderProductData & { selected: boolean }>, item) => {
        if (item.selected) {
          results.push({
            productId: item.id,
            quantity: item.quantity,
            selected: item.selected,
          });
        }
        return results;
      },
      [],
    );
  }, [productsInCart]);

  const { data, isLoading } = useGetProductsByIdsQuery({
    items: productsInCart.map((p) => p.id),
  });

  // init cart
  useEffect(() => {
    // create Order
    dispatch(
      createOrder({
        formIdentifier: 'order',
        formData: [],
        products: productsInOrder,
        paymentAccountIdentifier: '',
      }),
    );

    // add delivery Data
    if (!deliveryData) {
      return;
    }
    dispatch(
      addProductToCart({
        id: deliveryData.id,
        selected: true,
        quantity: 1,
      }),
    );
  }, []);

  // add products to cart slice
  useEffect(() => {
    if (data) {
      dispatch(addProductsToCart(data));
      setProducts(data);

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
  }, [data]);

  // add products to order
  useEffect(() => {
    if (productsInOrder) {
      dispatch(addProducts(productsInOrder));
    }
  }, [productsInOrder]);

  if (isLoading) {
    return <Loader />;
  }

  if (productsInCart.length < 2 || !data) {
    return <EmptyCart lang={lang} dict={dict} />;
  }

  return (
    <FadeTransition
      className="flex w-full flex-col overflow-hidden pb-5 lg:max-w-[730px]"
      index={0}
    >
      <CartAnimations className={'mb-4 flex w-full flex-col gap-4'} index={1}>
        {products.map((product: IProductsEntity, i: number) => {
          return (
            <ProductCard
              key={i}
              index={i}
              product={product}
              selected={productsInCart[i]?.selected}
              lang={lang}
            />
          );
        })}
      </CartAnimations>
      <DeliveryForm lang={lang} dict={dict} deliveryData={deliveryData} />
    </FadeTransition>
  );
};

export default CartPage;
