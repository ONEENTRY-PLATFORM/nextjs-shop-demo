import type { FC } from 'react';
import { Suspense } from 'react';

import WithSidebar from '@/app/[lang]/[page]/WithSidebar';
import { getBlockByMarker } from '@/app/api';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import type { PageProps } from '@/app/types/global';
import OrdersPage from '@/components/layout/orders';
import Loader from '@/components/shared/Loader';
import type { Locale } from '@/i18n-config';

import { getDictionary } from '../dictionaries';

/**
 * Orders page
 * @async server component
 * @param params page params
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @returns Orders page layout JSX.Element
 */
const OrdersPageLayout: FC<PageProps> = async ({ params }) => {
  const { lang } = await params;
  // Get the dictionary from the API and set the server provider.
  const [dict] = ServerProvider('dict', await getDictionary(lang as Locale));

  // Get block by marker from the API.
  const { block, isError } = await getBlockByMarker('orders_settings', lang);

  if (!block || isError) {
    return;
  }

  return (
    <section className="relative mx-auto box-border flex min-h-80 w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <WithSidebar lang={lang}>
          <Suspense fallback={<Loader />}>
            <OrdersPage
              lang={lang}
              dict={dict}
              settings={block.attributeValues}
            />
          </Suspense>
        </WithSidebar>
      </div>
    </section>
  );
};

export default OrdersPageLayout;
