import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import WithSidebar from '@/app/[lang]/[page]/WithSidebar';
import { getProductById } from '@/app/api';
import { useServerProvider } from '@/app/store/providers/ServerProvider';
import type { PageProps } from '@/app/types/global';
import CartPage from '@/components/layout/cart';
import type { Locale } from '@/i18n-config';

import { getDictionary } from '../dictionaries';

/**
 * Cart page
 * @async server component
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @param params
 * @returns Cart page layout JSX.Element
 */
const CartPageLayout: FC<PageProps> = async ({ params: { lang } }) => {
  // Get dictionary and set to server provider
  const [dict] = useServerProvider('dict', await getDictionary(lang as Locale));

  // Get delivery(product) data by product id
  const { product } = await getProductById(83, lang);

  return (
    <section className="relative mx-auto box-border flex min-h-80 w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <WithSidebar lang={lang}>
          <CartPage
            lang={lang}
            dict={dict}
            deliveryData={product as IProductsEntity}
          />
        </WithSidebar>
      </div>
    </section>
  );
};

export default CartPageLayout;
