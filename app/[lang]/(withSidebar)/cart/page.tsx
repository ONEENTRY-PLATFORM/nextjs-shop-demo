import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import { getProductById } from '@/app/api';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import type { PageProps } from '@/app/types/global';
import CartPage from '@/components/layout/cart';
import { i18n, type Locale } from '@/i18n-config';

import { getDictionary } from '../../dictionaries';

/** Define the response type */
type ProductResponse = {
  isError: boolean;
  error?: {
    statusCode: number;
    message: string;
  };
  product?: IProductsEntity;
};

/**
 * Cart page component that renders the shopping cart page.
 *
 * This async server component fetches dictionary data for internationalization
 * and delivery product data, then renders the cart page content. The sidebar
 * comes from the persistent `(withSidebar)` layout.
 * @param   {object}               props        - Page props
 * @param   {PageProps}            props.params - page params containing route parameters
 * @returns {Promise<JSX.Element>}              Cart page layout JSX.Element
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 */
const CartPageLayout = async ({ params }: PageProps): Promise<JSX.Element> => {
  const { lang } = await params;
  /** Get dictionary and set to server provider */
  const [dict] = ServerProvider('dict', await getDictionary(lang as Locale));

  /** Get delivery(product) data by product id */
  const response = await getProductById(83, lang);

  /** Check if response has error */
  const deliveryData = response.isError
    ? undefined
    : (response as ProductResponse).product;

  /** Render cart page content (the sidebar is provided by the group layout) */
  return (
    <CartPage
      lang={lang}
      dict={dict}
      deliveryData={deliveryData as IProductsEntity}
    />
  );
};

export default CartPageLayout;

/**
 * Pre-generation page params
 * @returns {Promise<{ lang: string }[]>} Static params for pre-generation
 */
export async function generateStaticParams(): Promise<{ lang: string }[]> {
  /** Initialize empty array for static params */
  const params: Array<{ lang: string }> = [];
  /** Loop through all available locales and add them to params */
  for (const lang of i18n.locales) {
    params.push({ lang });
  }
  /** Return array of static params for pre-rendering */
  return params;
}
