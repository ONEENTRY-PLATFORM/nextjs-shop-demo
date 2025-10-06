'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX, Key } from 'react';
import { memo, useContext, useEffect, useState } from 'react';

import { api, useGetProductsByIdsQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { selectFavoritesItems } from '@/app/store/reducers/FavoritesSlice';
import type { SimplePageProps } from '@/app/types/global';
import EmptyFavorites from '@/components/layout/favorites/EmptyFavorites';

import ProductCard from '../products-grid/components/product-card/ProductCard';
import ProductsGridLoader from '../products-grid/components/ProductsGridLoader';

/**
 * Favorites page.
 * @param   {SimplePageProps}  props      - Page props.
 * @param   {string}           props.lang - Current language shortcode.
 * @param   {IAttributeValues} props.dict - dictionary from server api.
 * @returns {JSX.Element}                 favorites page with animations.
 */
const FavoritesPage = ({ lang, dict }: SimplePageProps): JSX.Element => {
  const { isAuth } = useContext(AuthContext);
  const [products, setProducts] = useState<IProductsEntity[]>([]);
  const favoritesIds = useAppSelector(
    (state: { favoritesReducer: { products: number[] } }) =>
      selectFavoritesItems(state),
  ) as Array<number>;

  const { data, isLoading } = useGetProductsByIdsQuery({
    items: favoritesIds.toString(),
  });

  /**
   * Effect hook to update products data and handle real-time notifications.
   *
   * When the data or authentication status changes, this effect:
   * 1. Updates the local products state with new data
   * 2. If user is authenticated, establishes a WebSocket connection to listen for product updates
   * 3. Processes real-time notifications about product changes (price, status, etc.)
   * 4. Cleans up the WebSocket connection on component unmount
   * @param isAuth - Authentication status of the user
   * @param data   - Product data fetched from the API
   */
  useEffect(() => {
    // Update products state when new data is available
    if (data) {
      setProducts(data);
      // Only connect to WebSocket if user is authenticated
      if (isAuth) {
        const ws = api.WS.connect();
        if (ws) {
          // Listen for product update notifications
          ws.on('notification', async (res) => {
            // Process product data from notification
            if (res?.product) {
              const product = {
                ...res.product,
                attributeValues: res.product?.attributes,
              };

              // Find the index of the updated product in the current list
              const index = data.findIndex(
                (p: IProductsEntity) => p.id === product.id,
              );
              // Extract and parse the new price from product attributes
              const newPrice = parseInt(
                product?.attributeValues?.price?.value,
                10,
              );

              // Update the product in the state with new price and status
              setProducts((prevProducts) => {
                const newProducts = [...prevProducts];
                if (index !== -1 && products[index]) {
                  newProducts[index] = {
                    ...products[index],
                    price: newPrice,
                    statusIdentifier: res?.product?.status?.identifier,
                  };
                }
                return newProducts;
              });
            }
          });
          // Cleanup function to disconnect WebSocket on unmount
          return () => {
            ws.disconnect();
          };
        }
      }
    }
    return;
  }, [isAuth, data, products]);

  // Memoize the loader component
  const MemoizedProductsGridLoader = memo(ProductsGridLoader);

  // Handle empty favorites state - show empty favorites component or loading spinner
  if (!products || products.length < 1) {
    // If data has finished loading but there are no products, show empty state
    if (!isLoading) {
      return (
        <EmptyFavorites lang={lang as string} dict={dict as IAttributeValues} />
      );
    } else {
      // If data is still loading, show loading spinner
      return <MemoizedProductsGridLoader />;
    }
  }

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <div className={'relative box-border flex w-full shrink-0 flex-col'}>
        <section className="relative mx-auto box-border flex min-h-[320px] w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
            {/* Let's make sure products are an array before calling map */}
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product: IProductsEntity, index: Key | number) => {
                return (
                  <ProductCard
                    key={index}
                    product={product}
                    index={index as number}
                    lang={lang as string}
                    dict={dict as IAttributeValues}
                    pagesLimit={0}
                  />
                );
              })
            ) : (
              <EmptyFavorites
                lang={lang as string}
                dict={dict as IAttributeValues}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FavoritesPage;
