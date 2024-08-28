import { Suspense } from 'react';

import OrdersPage from '@/components/layout/orders/OrdersPage';
import Loader from '@/components/shared/Loader';

import WithSidebar from '../[page]/WithSidebar';

export const revalidate = 10;
export const dynamicParams = true;

const Page = async () => {
  return (
    <section className="relative mx-auto box-border flex min-h-80 w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <Suspense fallback={<Loader />}>
          <WithSidebar>
            <OrdersPage />
          </WithSidebar>
        </Suspense>
      </div>
    </section>
  );
};

export default Page;
