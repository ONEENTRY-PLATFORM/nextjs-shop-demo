/* eslint-disable @next/next/no-async-client-component */
// 'use client';
import { Suspense } from 'react';

import CatalogGrid from '@/components/layout/catalog/CatalogGrid';

// import { getPages } from './api/serverSideProps';

const catalogCards = [
  {
    title: 'Catalog',
    backgroundColor: 'bg-amber-600',
    width: 'w-full',
    height: 'h-[175px]',
    imageSrc: '/images/catalog-img-1.svg',
    link: '/catalog',
  },
  {
    title: 'BEST SELLER',
    backgroundColor: 'bg-purple-600',
    width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
    height: 'h-[260px]',
    imageSrc: '/images/catalog-img-2.svg',
    link: '',
  },
  {
    title: 'PROMOTION',
    backgroundColor: 'bg-blue-500',
    width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
    height: 'h-[260px]',
    imageSrc: '/images/catalog-img-3.svg',
    link: '',
  },
  {
    title: 'OFFER OF TODAY',
    backgroundColor: 'bg-lime-700',
    width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
    height: 'h-[260px]',
    imageSrc: '/images/catalog-img-4.svg',
    link: '',
  },
  {
    title: 'NEW\nARRIVALS',
    backgroundColor: 'bg-teal-300',
    width: 'w-full md:w-[calc(_50%_-_0.65rem)]',
    height: 'h-[260px]',
    imageSrc: '/images/catalog-img-5.svg',
    link: '',
  },
  {
    title: 'Join OUR COMMUNITY',
    backgroundColor: 'bg-amber-300',
    width: 'w-full lg:w-[calc(_50%_-_0.65rem)]',
    height: 'h-[260px]',
    imageSrc: '/images/catalog-img-6.svg',
    link: '',
  },
];

export default async function Home() {
  // const pages = await getPages('en_US');

  return (
    <main className="flex flex-col items-center justify-between gap-16 px-5 py-8">
      <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
        <div className="flex w-full flex-col items-center gap-5 bg-white">
          <div className="">
            <Suspense
              fallback={
                <div className="relative aspect-square size-full max-h-[550px] overflow-hidden" />
              }
            />
          </div>
          <CatalogGrid cards={catalogCards} />
        </div>
      </section>
    </main>
  );
}
