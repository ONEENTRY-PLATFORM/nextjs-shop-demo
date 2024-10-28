/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useTransitionRouter } from 'next-transition-router';
import type { IOrderProductData } from 'oneentry/dist/orders/ordersInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { useContext, useEffect, useMemo, useState } from 'react';

import { useGetProductsByIds } from '@/app/api/hooks/useGetProductsByIds';
import { updateUserState } from '@/app/api/server/users/updateUserState';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import {
  addProductToCart,
  selectCartItems,
} from '@/app/store/reducers/CartSlice';
import { addProducts, createOrder } from '@/app/store/reducers/OrderSlice';
import CartAnimations from '@/components/layout/cart/animations/CartAnimations';
import EmptyCart from '@/components/layout/cart/components/EmptyCart';
import PaymentButton from '@/components/layout/cart/components/PaymentButton';
import ProductCard from '@/components/layout/cart/components/ProductCard';
import TotalAmount from '@/components/layout/cart/components/TotalAmount';
import DeliveryTable from '@/components/layout/cart/delivery-table/DeliveryTable';
import Loader from '@/components/shared/Loader';

interface IProducts {
  id: number;
  selected: boolean;
  quantity: number;
}

const CartPage: FC<{
  lang: string;
  dict: any;
  deliveryData: IProductsEntity;
}> = ({ lang, dict, deliveryData }) => {
  const router = useTransitionRouter();
  const dispatch = useAppDispatch();

  const { user, isAuth } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  const productsInCart = useAppSelector(selectCartItems) as Array<IProducts>;

  console.log(productsInCart);

  // const productsInOrder = useMemo(() => {
  //   return productsInCart.reduce((results: Array<IOrderProductData>, item) => {
  //     if (item.selected) {
  //       results.push({
  //         productId: item.id,
  //         quantity: item.quantity,
  //         selected: item.selected,
  //       });
  //     }
  //     return results;
  //   }, []);
  // }, [productsInCart]);

  // create Order
  // useEffect(() => {
  //   setIsLoading(false);
  //   dispatch(
  //     createOrder({
  //       formIdentifier: 'order',
  //       formData: [],
  //       products: productsInOrder,
  //       paymentAccountIdentifier: '',
  //     }),
  //   );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // add products to order
  // useEffect(() => {
  //   if (productsInOrder) {
  //     dispatch(addProducts(productsInOrder));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [productsInOrder]);

  // add delivery product to cart
  // useEffect(() => {
  //   if (!deliveryData) {
  //     return;
  //   }
  //   const index = productsInCart.findIndex(
  //     (p: { id: number }) => p.id === deliveryData?.id,
  //   );
  //   if (index === -1) {
  //     dispatch(
  //       addProductToCart({
  //         id: deliveryData.id,
  //         selected: true,
  //         quantity: 1,
  //       }),
  //     );
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [deliveryData]);

  // update user data
  // useEffect(() => {
  //   if (!isAuth || !user?.state?.cart) {
  //     return;
  //   }

  //   async function updateUser(productsInCart: IProducts[]) {
  //     await updateUserState({
  //       cart: productsInCart,
  //       user: user,
  //     });
  //   }

  //   user.state.cart?.forEach((product: IProducts) => {
  //     dispatch(
  //       addProductToCart({ id: product.id, selected: true, quantity: 1 }),
  //     );
  //   });
  //   updateUser([...user.state.cart, ...productsInCart]);

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isAuth]);

  // const items = productsInCart.map((product) => product.id);

  // const { products } = useGetProductsByIds({
  //   items: items,
  // });

  // if (isLoading) {
  //   return <Loader />;
  // }

  if (productsInCart.length < 2) {
    return <EmptyCart lang={lang} dict={dict} />;
  }

  // return (
  //   <div className="flex w-full flex-col pb-5 lg:max-w-[730px]">
  //     <CartAnimations className={'mb-4 flex w-full flex-col gap-4'}>
  //       {products.map((product: IProductsEntity, i: number) => {
  //         if (product.id === 83) {
  //           return;
  //         }
  //         return (
  //           <ProductCard
  //             key={i}
  //             product={product as IProductsEntity & { selected: boolean }}
  //             selected={productsInCart[i]?.selected}
  //             lang={lang}
  //           />
  //         );
  //       })}
  //     </CartAnimations>
  //     <form
  //       className="flex w-[730px] max-w-full flex-col pb-5"
  //       onSubmit={(e) => {
  //         e.preventDefault();
  //         router.push('/payment');
  //       }}
  //     >
  //       <DeliveryTable
  //         lang={lang}
  //         dict={dict}
  //         delivery={deliveryData as IProductsEntity}
  //       />
  //       <div id="total" className="mt-4 flex w-full flex-col">
  //         <TotalAmount
  //           lang={lang}
  //           dict={dict}
  //           className="flex self-center text-lg font-bold leading-6 text-slate-700 lg:self-end"
  //         />
  //         <PaymentButton
  //           text={dict.go_to_pay_placeholder?.value}
  //           className="self-end max-lg:self-center"
  //         />
  //       </div>
  //     </form>
  //   </div>
  // );

  return null;
};

export default CartPage;
