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
  /** Array of product entities to display */
  products: Array<IProductsEntity>;
  /** Current language shortcode (e.g., 'en', 'fr') */
  lang: string;
  /** Dictionary of localized strings from server API */
  dict: IAttributeValues;
  /** Maximum number of products to display per page, used for animations */
  pagesLimit: number;
  /** Current page number, used for animations (default: 1) */
  currentPage?: number;
}

/**
 * ProductsGrid component that displays a grid of products
 * 
 * This component renders a responsive grid of products with support for both
 * individual products and product groups. It handles language localization
 * and passes necessary data to child components for animations.
 * 
 * @param products - Array of product entities to display
 * @param lang - Current language shortcode
 * @param dict - Dictionary of localized strings from server API
 * @param pagesLimit - Maximum number of products to display per page
 * @param currentPage - Current page number for animations (default: 1)
 * @returns Responsive grid of product cards
 */
const ProductsGrid: FC<ProductsGridProps> = ({
  products,
  lang,
  dict,
  pagesLimit,
  currentPage = 1,
}) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  /**
   * Prepare products with localized data
   * 
   * This memoized function processes the product data to ensure proper
   * localization based on the current language. It selects the appropriate
   * language-specific attribute values and localized information.
   */
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