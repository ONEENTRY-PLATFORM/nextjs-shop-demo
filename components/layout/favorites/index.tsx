'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';
import type { Key } from 'react';
import { type FC, useContext, useEffect } from 'react';

import FadeTransition from '@/app/animations/FadeTransition';
import { useGetProductsByIds } from '@/app/api/hooks/useGetProductsByIds';
import { updateUserState } from '@/app/api/server/users/updateUserState';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { selectCartData } from '@/app/store/reducers/CartSlice';
import {
  addFavorites,
  selectFavoritesItems,
} from '@/app/store/reducers/FavoritesSlice';
import type { IProducts, SimplePageProps } from '@/app/types/global';
import EmptyFavorites from '@/components/layout/favorites/EmptyFavorites';

import ProductCard from '../products-grid/components/product-card/ProductCard';
import ProductsGridLoader from '../products-grid/components/ProductsGridLoader';

const FavoritesPage: FC<SimplePageProps> = ({ lang, dict }) => {
  const { user, isAuth } = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const favoritesIds = useAppSelector(
    (state: { favoritesReducer: { products: number[] } }) =>
      selectFavoritesItems(state),
  ) as Array<number>;
  const productsInCart = useAppSelector(selectCartData) as IProducts[];

  const { products, isLoading } = useGetProductsByIds({ items: favoritesIds });

  // update user data from cart
  async function updateUser(favoritesIds: number[], user: IUserEntity) {
    await updateUserState({
      cart: productsInCart,
      favorites: favoritesIds,
      user: user,
    });
  }

  useEffect(() => {
    if (!isAuth || !user || !user.state) {
      return;
    }
    user.state.favorites.forEach((element: number) => {
      dispatch(addFavorites(element));
    });
    updateUser(favoritesIds, user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  if (isLoading) {
    return <ProductsGridLoader />;
  }

  if (products.length < 1) {
    return <EmptyFavorites lang={lang} dict={dict} />;
  }

  return (
    products.length && (
      <FadeTransition className="flex flex-col pb-5 max-md:max-w-full">
        <div className={'relative box-border flex w-full shrink-0 flex-col'}>
          <section className="relative mx-auto box-border flex min-h-[100px] w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
            <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
              {products.map((product: IProductsEntity, index: Key | number) => {
                return (
                  <ProductCard
                    key={index}
                    product={product}
                    index={index as number}
                    lang={lang}
                    dict={dict}
                  />
                );
              })}
            </div>
          </section>
        </div>
      </FadeTransition>
    )
  );
};

export default FavoritesPage;
