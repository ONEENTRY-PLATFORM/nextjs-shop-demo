import type { FC } from 'react';
import { Suspense } from 'react';

import WithSidebar from '@/app/[lang]/[page]/WithSidebar';
import OrdersPage from '@/components/layout/orders/OrdersPage';

const Page: FC<{ lang: string }> = async ({ lang }) => {
  return (
    <section className="relative mx-auto box-border flex min-h-80 w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <WithSidebar lang={lang}>
          <Suspense>
            <OrdersPage />
          </Suspense>
        </WithSidebar>
      </div>
    </section>
  );
};

export default Page;
