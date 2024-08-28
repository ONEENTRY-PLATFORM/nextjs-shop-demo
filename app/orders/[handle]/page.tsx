'use client';

import { Suspense } from 'react';

import WithSidebar from '@/app/[page]/WithSidebar';
import { useGetSingleOrderQuery } from '@/app/api';
// import { useAppSelector } from '@/app/store/hooks';
import Loader from '@/components/shared/Loader';

export default function CatalogPage({
  params,
}: {
  params: { handle: string };
}) {
  console.log(params);

  // const { data, isLoading, refetch } = useGetSingleOrderQuery({
  //   marker: params.handle,
  // });
  // console.log(data);

  // const {
  //   order_info_amount,
  //   order_info_status,
  //   order_info_quantity,
  //   order_info_total,
  //   order_info_address_placeholder,
  // } = useAppSelector((state) => state.systemContentReducer.content);

  return (
    <section className="relative mx-auto box-border flex min-h-80 w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <WithSidebar>OrderPage</WithSidebar>
      </div>
    </section>
  );
}
