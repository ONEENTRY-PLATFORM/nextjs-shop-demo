/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { type FC, type Key, useContext, useEffect, useState } from 'react';

import { api, useGetProductsByIdsQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { selectFavoritesItems } from '@/app/store/reducers/FavoritesSlice';
import type { SimplePageProps } from '@/app/types/global';
import EmptyFavorites from '@/components/layout/favorites/EmptyFavorites';

import ProductCard from '../products-grid/components/product-card/ProductCard';
import ProductsGridLoader from '../products-grid/components/ProductsGridLoader';

/**
 * Favorites page
 * @param lang Current language shortcode
 * @param dict dictionary from server api
 *
 * @returns favorites page with animations
 */
const FavoritesPage: FC<SimplePageProps> = ({ lang, dict }) => {
  const { isAuth } = useContext(AuthContext);
  const [products, setProducts] = useState<IProductsEntity[]>([]);
  const favoritesIds = useAppSelector(
    (state: { favoritesReducer: { products: number[] } }) =>
      selectFavoritesItems(state),
  ) as Array<number>;

  const { data, isLoading } = useGetProductsByIdsQuery({
    items: favoritesIds,
  });

  // set products on data change
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
  }, [isAuth, data]);

  if (!products || products.length < 1) {
    if (!isLoading) {
      return <EmptyFavorites lang={lang} dict={dict} />;
    } else {
      return <ProductsGridLoader />;
    }
  }

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
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
                  pagesLimit={0}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FavoritesPage;
