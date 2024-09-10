/* eslint-disable @typescript-eslint/no-unused-vars */
// 'use client';
// import { Suspense } from 'react';

import WithSidebar from '@/app/[page]/WithSidebar';
import { useGetSingleOrderQuery, useGetUserOrdersQuery } from '@/app/api';
import OrderPage from '@/components/layout/orders/OrderPage';
// import { useAppSelector } from '@/app/store/hooks';
// import Loader from '@/components/shared/Loader';

export default function CatalogPage({
  params,
}: {
  params: { handle: string };
}) {
  // const { data, isLoading, refetch } = useGetSingleOrderQuery({
  //   marker: 'order',
  //   id: 135,
  //   activeLang: 'en_US',
  // });
  // const { data, isLoading, refetch } = useGetUserOrdersQuery({
  //   marker: 'order',
  // });

  // console.log(data);

  // const {
  //   order_info_amount,
  //   order_info_status,
  //   order_info_quantity,
  //   order_info_total,
  //   order_info_address_placeholder,
  // } = useAppSelector((state) => state.systemContentReducer.content);
  // !!!
  return (
    <section className="relative mx-auto box-border flex min-h-80 w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <WithSidebar>
          <OrderPage />
        </WithSidebar>
      </div>
    </section>
  );
}
