'use client';

import type {
  IFilterParams,
  IProductsEntity,
} from 'oneentry/dist/products/productsInterfaces';
import { useContext, useEffect, useState } from 'react';

// eslint-disable-next-line import/no-cycle
import { LanguageContext } from '../../store/providers/LanguageContext';
import { api } from '../api/api';

type UseGetProductsProps = {
  pageUrl?: string;
  offset: number;
  limit: number | null;
  filters?: IFilterParams[];
  searchValue?: string;
  disableLoading?: boolean;
  sortKey: 'id' | 'position' | 'title' | 'date' | 'price';
  sortOrder: 'DESC' | 'ASC';
  availability?: boolean;
};

export const useGetProducts = ({
  pageUrl,
  offset,
  filters,
  limit,
  searchValue,
  sortKey,
  sortOrder,
  availability,
  disableLoading,
}: UseGetProductsProps) => {
  const [products, setProducts] = useState<IProductsEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { activeLanguage } = useContext(LanguageContext);
  const [refresh, setRefresh] = useState<boolean>(false);

  const findProducts = async () => {
    if (limit && pageUrl) {
      try {
        console.log(
          sortOrder + searchValue + sortKey + offset + filters + limit,
        );

        if (!searchValue) {
          const expandedFilters = filters ? [...filters] : [];

          // If availability is true, add the new filter object
          console.log(availability);
          // if (availability) {
          //   expandedFilters.push({statusMarker: 'in_stock'});
          // }

          const res = await api.Products.getProductsByPageUrl(
            pageUrl,
            expandedFilters,
            activeLanguage,
            {
              sortOrder,
              sortKey,
              offset,
              limit,
            },
          );

          return res;
        }
        if (searchValue && !filters) {
          const result = await api.Products.searchProduct(
            searchValue,
            activeLanguage,
          );
          return result.filter(
            (item) => item.attributeSetIdentifier === 'product',
          );
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        /** */
      }
    }
  };

  useEffect(() => {
    (async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      (offset < 1 || disableLoading) && setLoading(true);
      let result = await findProducts();
      result = result?.filter((res) => {
        return res.isVisible;
      });
      if (result) {
        setProducts((prevState: IProductsEntity[]): IProductsEntity[] => {
          if (offset > 0) {
            return [...prevState, ...(result as IProductsEntity[])];
          }
          return result as IProductsEntity[];
        });
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, activeLanguage, filters, searchValue, offset, refresh]);

  return {
    products,
    loading,
    refetch: () => setRefresh(!refresh),
  };
};
