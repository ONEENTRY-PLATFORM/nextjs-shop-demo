import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { Suspense } from 'react';

import WithSidebar from '@/app/[lang]/[page]/WithSidebar';
import { getProductById } from '@/app/api';
import { useServerProvider } from '@/app/store/providers/ServerProvider';
import CartPage from '@/components/layout/cart';
import Loader from '@/components/shared/Loader';
import type { Locale } from '@/i18n-config';

import { getDictionary } from '../dictionaries';

const CartPageLayout: FC<{
  params: { page: string; lang: string };
}> = async ({ params: { lang } }) => {
  const [dict] = useServerProvider('dict', await getDictionary(lang as Locale));
  // deliveryData
  const { product } = await getProductById(83, lang);

  return (
    <section className="relative mx-auto box-border flex min-h-80 w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <WithSidebar lang={lang}>
          <Suspense fallback={<Loader />}>
            <CartPage
              lang={lang}
              dict={dict}
              deliveryData={product as IProductsEntity}
            />
          </Suspense>
        </WithSidebar>
      </div>
    </section>
  );
};

export default CartPageLayout;
