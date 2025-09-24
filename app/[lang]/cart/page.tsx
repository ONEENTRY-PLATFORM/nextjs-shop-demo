import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import WithSidebar from '@/app/[lang]/[page]/WithSidebar';
import { getProductById } from '@/app/api';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import type { PageProps } from '@/app/types/global';
import CartPage from '@/components/layout/cart';
import { i18n, type Locale } from '@/i18n-config';

import { getDictionary } from '../dictionaries';

// Define the response type
type ProductResponse = {
  isError: boolean;
  error?: {
    statusCode: number;
    message: string;
  };
  product?: IProductsEntity;
};

/**
 * Cart page
 * @async server component
 * @param params
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @returns Cart page layout JSX.Element
 */
const CartPageLayout: FC<PageProps> = async ({ params }) => {
  const { lang } = await params;
  // Get dictionary and set to server provider
  const [dict] = ServerProvider('dict', await getDictionary(lang as Locale));

  // Get delivery(product) data by product id
  const response = await getProductById(83, lang);
  const deliveryData = response.isError
    ? undefined
    : (response as ProductResponse).product;

  return (
    <section className="relative mx-auto box-border flex min-h-80 w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <WithSidebar lang={lang}>
          <CartPage
            lang={lang}
            dict={dict}
            deliveryData={deliveryData as IProductsEntity}
          />
        </WithSidebar>
      </div>
    </section>
  );
};

export default CartPageLayout;

/**
 * Pre-generation page params
 */
export async function generateStaticParams() {
  const params: Array<{ lang: string }> = [];
  for (const lang of i18n.locales) {
    params.push({ lang });
  }
  return params;
}
