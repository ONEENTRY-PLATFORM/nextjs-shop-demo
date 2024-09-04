// 'use client';

// import { Suspense } from 'react';

import WithSidebar from '@/app/[page]/WithSidebar';
// import { useGetOrderStorageByMarkerQuery } from '@/app/api';
// import { useAppSelector } from '@/app/store/hooks';
// import Loader from '@/components/shared/Loader';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Page({ params }: { params: { handle: string } }) {
  // const { data, isLoading, refetch } = useGetSingleOrderQuery({
  //   marker: params.handle,
  // });
  // console.log(data);
  return (
    <section className="relative mx-auto box-border flex min-h-80 w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <WithSidebar>Payment Page</WithSidebar>
      </div>
    </section>
  );
}
