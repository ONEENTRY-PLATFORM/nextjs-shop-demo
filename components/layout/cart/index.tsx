/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useTransitionRouter } from 'next-transition-router';
import type { IOrderProductData } from 'oneentry/dist/orders/ordersInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';
import type { FC } from 'react';
import { useContext, useEffect, useMemo, useState } from 'react';

import { updateUserState } from '@/app/api/server/users/updateUserState';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import {
  addProductToCart,
  selectCartItems,
} from '@/app/store/reducers/CartSlice';
import { selectFavoritesItems } from '@/app/store/reducers/FavoritesSlice';
import { addProducts, createOrder } from '@/app/store/reducers/OrderSlice';
import type { IProducts } from '@/app/types/global';
import CartAnimations from '@/components/layout/cart/animations/CartAnimations';
import EmptyCart from '@/components/layout/cart/components/EmptyCart';
import PaymentButton from '@/components/layout/cart/components/PaymentButton';
import ProductCard from '@/components/layout/cart/components/ProductCard';
import TotalAmount from '@/components/layout/cart/components/TotalAmount';
import DeliveryTable from '@/components/layout/cart/delivery-table/DeliveryTable';
import Loader from '@/components/shared/Loader';

const CartPage: FC<{
  lang: string;
  dict: any;
  deliveryData: IProductsEntity;
}> = ({ lang, dict, deliveryData }) => {
  const router = useTransitionRouter();
  const dispatch = useAppDispatch();

  const { user, isAuth } = useContext(AuthContext);
  // const [isLoading, setIsLoading] = useState(true);

  const favoritesIds = useAppSelector(
    (state: { favoritesReducer: { products: number[] } }) =>
      selectFavoritesItems(state),
  ) as Array<number>;

  const productsInCart = useAppSelector(selectCartItems) as IProducts[];
  const items = productsInCart.map((product) => product.id);

  // const { products, isLoading } = useGetProductsByIds({
  //   items: items,
  // });

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
    const index = productsInCart.findIndex(
      (p: { id: number }) => p.id === deliveryData?.id,
    );
    if (index === -1) {
      dispatch(
        addProductToCart({
          id: deliveryData.id,
          selected: true,
          quantity: 1,
        }),
      );
    }
  }, []);

  // add products to order
  useEffect(() => {
    if (productsInOrder) {
      dispatch(addProducts(productsInOrder));
    }
  }, [productsInOrder]);

  // update cart from user data
  // useEffect(() => {
  //   if (!isAuth || !user || !user.state?.cart) {
  //     return;
  //   }
  //   user.state.cart?.forEach((product: IProducts) => {
  //     dispatch(
  //       addProductToCart({ id: product.id, selected: true, quantity: 1 }),
  //     );
  //   });
  // }, [isAuth]);

  // update user data from cart
  // useEffect(() => {
  //   if (!isAuth || !user || !user.state?.cart) {
  //     return;
  //   }
  //   async function updateUser(productsInCart: IProducts[], user: IUserEntity) {
  //     await updateUserState({
  //       favorites: favoritesIds,
  //       cart: productsInCart,
  //       user: user,
  //     });
  //   }
  //   updateUser(productsInCart, user as IUserEntity);
  // }, [productsInCart]);

  // if (isLoading) {
  //   return <Loader />;
  // }

  if (productsInCart.length < 2) {
    return <EmptyCart lang={lang} dict={dict} />;
  }

  return (
    <div className="flex w-full flex-col pb-5 lg:max-w-[730px]">
      <CartAnimations className={'mb-4 flex w-full flex-col gap-4'}>
        {productsInCart.map((product: IProducts, i: number) => {
          if (product.id === 83) {
            return;
          }
          return (
            <ProductCard
              key={i}
              productData={product as IProducts}
              selected={productsInCart[i]?.selected}
              lang={lang}
            />
          );
        })}
      </CartAnimations>
      <form
        className="flex w-[730px] max-w-full flex-col pb-5"
        onSubmit={(e) => {
          e.preventDefault();
          router.push('/payment');
        }}
      >
        <DeliveryTable
          lang={lang}
          dict={dict}
          delivery={deliveryData as IProductsEntity}
        />
        <div id="total" className="mt-4 flex w-full flex-col">
          <TotalAmount
            lang={lang}
            dict={dict}
            className="flex self-center text-lg font-bold leading-6 text-slate-700 lg:self-end"
          />
          <PaymentButton
            text={dict.go_to_pay_placeholder?.value}
            className="self-end max-lg:self-center"
          />
        </div>
      </form>
    </div>
  );
};

export default CartPage;
