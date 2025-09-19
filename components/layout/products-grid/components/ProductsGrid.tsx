'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { useMemo } from 'react';

import { LanguageEnum } from '@/app/types/enum';
import GroupCard from '@/components/layout/product/group-card/GroupCard';
import Placeholder from '@/components/shared/Placeholder';

import ProductCard from './product-card/ProductCard';

interface ProductsGridProps {
  products: Array<IProductsEntity>;
  lang: string;
  dict: IAttributeValues;
  pagesLimit: number;
  currentPage?: number;
}

/**
 * Products grid
 * @param products array of products entity object
 * @param lang current language shortcode
 * @param dict dictionary from server api
 * @param pagesLimit used for animations
 * @param currentPage current page number for animations
 *
 * @returns Products grid
 */
const ProductsGrid: FC<ProductsGridProps> = ({
  products,
  lang,
  dict,
  pagesLimit,
  currentPage = 1,
}) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  const preparedProducts = useMemo(
    () =>
      products.map((product) => {
        return {
          ...product,
          // Select language
          attributeValues:
            product.attributeValues?.[langCode] || product.attributeValues,
          localizeInfos: {
            ...product.localizeInfos,
            title:
              product.localizeInfos?.[langCode]?.title ||
              product.localizeInfos?.title ||
              '',
          },
        };
      }),
    [products, langCode],
  );

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-2">
      {preparedProducts.map((product, i) => {
        // Check if product has multiply items marker
        const isGroup =
          product?.attributeValues?.multiply_items?.value ||
          product?.attributeValues?.multiply_items;

        return isGroup ? (
          <GroupCard
            key={product.id + '_' + i}
            product={product}
            lang={lang}
            dict={dict}
          />
        ) : (
          <ProductCard
            key={product.id + '_' + i}
            product={product}
            lang={lang}
            dict={dict}
            index={i}
            pagesLimit={pagesLimit}
            currentPage={currentPage}
          />
        );
      })}
      {preparedProducts && preparedProducts.length < 1 && (
        <Placeholder className="col-span-4" />
      )}
    </div>
  );
};

export default ProductsGrid;
