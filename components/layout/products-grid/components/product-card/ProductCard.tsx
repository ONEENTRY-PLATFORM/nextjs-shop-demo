import Link from 'next/link';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { type FC, useMemo, useRef, useState } from 'react';

import { getProductTitle } from '@/app/hooks/useProductsData';
import { LanguageEnum } from '@/app/types/enum';
import AddToCartButton from '@/components/layout/product/components/AddToCartButton';
import FavoritesButton from '@/components/shared/FavoritesButton';

import CardAnimations from '../../animations/CardAnimations';
import PriceDisplay from './PriceDisplay';
import ProductImage from './ProductImage';
import Stickers from './Stickers';

interface ProductCardProps {
  /** Product entity object containing all product data */
  product: IProductsEntity;
  /** Current language shortcode (e.g., 'en', 'fr') */
  lang: string;
  /** Index of element for animations stagger */
  index: number;
  /** Dictionary of localized strings from server API */
  dict: IAttributeValues;
  /** Maximum number of products to display per page, used for animations */
  pagesLimit: number;
  /** Current page number, used for animations (default: 1) */
  currentPage?: number;
}

/**
 * ProductCard component that displays a single product in the product grid
 *
 * This component renders an individual product card with its image, title, price,
 * and action buttons. It includes animations, stickers for special product states,
 * and links to the product detail page.
 *
 * @param product - Product entity object containing all product data
 * @param lang - Current language shortcode
 * @param index - Index of element for animations stagger
 * @param dict - Dictionary of localized strings from server API
 * @param pagesLimit - Maximum number of products to display per page
 * @param currentPage - Current page number for animations (default: 1)
 * @returns Product card with image, title, price and action buttons
 */
const ProductCard: FC<ProductCardProps> = ({
  product,
  lang,
  dict,
  index,
  pagesLimit,
  currentPage = 1,
}) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const { id, statusIdentifier, attributeValues } = product;
  const cardRef = useRef<HTMLDivElement>(null);
  const [isPrefetch, setPrefetch] = useState(false);

  /**
   * Get localized product attributes
   *
   * Extracts the attributes for the current language, falling back to the
   * default attributes if language-specific ones are not available.
   */
  const attributes = useMemo(
    () => attributeValues?.[langCode] || attributeValues,
    [attributeValues, langCode],
  );

  /**
   * Get localized product title
   *
   * Extracts the title for the current language, with fallbacks to the
   * language-specific title or default title if not available.
   */
  const title = useMemo(
    () => getProductTitle(product, langCode, ''),
    [product, langCode],
  );

  // Safely extract units value
  const units = useMemo(() => {
    if (
      attributeValues?.units_product &&
      typeof attributeValues.units_product === 'object' &&
      'value' in attributeValues.units_product
    ) {
      return attributeValues.units_product.value;
    }
    return undefined;
  }, [attributeValues]);

  return (
    <div ref={cardRef}>
      <CardAnimations
        className="product-card group"
        index={index}
        pagesLimit={pagesLimit}
        currentPage={currentPage}
      >
        <div className="z-10 flex justify-between gap-5 self-stretch">
          <Stickers product={product} lang={lang} />
          <FavoritesButton {...product} />
        </div>

        {/* ProductImage */}
        <ProductImage product={product} alt={title} />

        {/* Product Data */}
        <div className="z-10 mb-5 mt-auto flex w-full max-w-[160px] flex-col gap-2.5">
          <h2 className="text-center text-sm leading-4 text-neutral-600">
            {title}
          </h2>

          <PriceDisplay attributes={attributes} lang={lang} />

          <AddToCartButton
            id={id}
            productTitle={title}
            statusIdentifier={statusIdentifier || ''}
            units={units}
            dict={dict}
            height={42}
            className="btn btn-md btn-primary"
          />
        </div>

        <Link
          title={title}
          prefetch={isPrefetch}
          onMouseEnter={() => setPrefetch(true)}
          href={'/' + lang + '/shop/product/' + id}
          className="absolute left-0 top-0 z-0 flex size-full"
        ></Link>
      </CardAnimations>
    </div>
  );
};

export default ProductCard;
