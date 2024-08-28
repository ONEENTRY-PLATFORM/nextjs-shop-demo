import { Suspense } from 'react';

import OrdersPage from '@/components/layout/pages/OrdersPage';
import Loader from '@/components/shared/Loader';

import WithSidebar from '../[page]/WithSidebar';

export const revalidate = 10;
export const dynamicParams = true;

const Page = async () => {
  return (
    <main className="flex flex-col items-center justify-between gap-16 px-5 py-8">
      <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
        <div className="flex w-full flex-col items-center gap-5 bg-white">
          <Suspense fallback={<Loader />}>
            <WithSidebar>
              <OrdersPage />
            </WithSidebar>
          </Suspense>
        </div>
      </section>
    </main>
  );
};

export default Page;
