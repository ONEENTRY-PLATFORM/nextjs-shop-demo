import type { FC } from 'react';
import { Suspense } from 'react';

import WithSidebar from '@/app/[lang]/[page]/WithSidebar';
import OrdersPage from '@/components/layout/orders';
import Loader from '@/components/shared/Loader';

const Page: FC<{
  params: { page: string; lang: string };
}> = async ({ params: { page, lang } }) => {
  return (
    <section className="relative mx-auto box-border flex min-h-80 w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <WithSidebar lang={lang}>
          <Suspense fallback={<Loader />}>
            <OrdersPage page={page} lang={lang} />
          </Suspense>
        </WithSidebar>
      </div>
    </section>
  );
};

export default Page;
