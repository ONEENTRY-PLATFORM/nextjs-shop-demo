import { Suspense } from 'react';

import WithSidebar from '@/app/[page]/WithSidebar';
import { useGetOrderStorageByMarkerQuery } from '@/app/api';
// import { useAppSelector } from '@/app/store/hooks';
import Loader from '@/components/shared/Loader';

export default async function CatalogPage({
  params,
}: {
  params: { handle: string };
}) {
  const { data, isLoading, refetch } = useGetOrderStorageByMarkerQuery({
    marker: params.handle,
  });
  console.log(data);

  // const {
  //   order_info_amount,
  //   order_info_status,
  //   order_info_quantity,
  //   order_info_total,
  //   order_info_address_placeholder,
  // } = useAppSelector((state) => state.systemContentReducer.content);

  return (
    <main className="flex flex-col items-center justify-between gap-16 px-5 py-8">
      <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
        <div className="flex w-full flex-col items-center gap-5 bg-white">
          <Suspense fallback={<Loader />}>
            <WithSidebar>OrderPage</WithSidebar>
          </Suspense>
        </div>
      </section>
    </main>
  );
}
