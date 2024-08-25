import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import CatalogCard from './CatalogCard';

const CatalogGrid: React.FC<{
  blocks: string[];
}> = async ({ blocks }) => {
  if (blocks?.length < 1) {
    return;
  }

  // const catalogCards = [
  //   {
  //     title: 'Catalog',
  //     backgroundColor: 'bg-amber-600',
  //     width: 'w-full',
  //     height: 'h-[175px]',
  //     imageSrc: '/images/catalog-img-1.svg',
  //     link: '/shop',
  //   },
  //   {
  //     title: 'BEST SELLER',
  //     backgroundColor: 'bg-purple-600',
  //     width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
  //     height: 'h-[260px]',
  //     imageSrc: '/images/catalog-img-2.svg',
  //     link: '/shop/best',
  //   },
  //   {
  //     title: 'PROMOTION',
  //     backgroundColor: 'bg-blue-500',
  //     width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
  //     height: 'h-[260px]',
  //     imageSrc: '/images/catalog-img-3.svg',
  //     link: '/shop/promotion',
  //   },
  //   {
  //     title: 'OFFER OF TODAY',
  //     backgroundColor: 'bg-lime-700',
  //     width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
  //     height: 'h-[260px]',
  //     imageSrc: '/images/catalog-img-4.svg',
  //     link: '/shop/offer',
  //   },
  //   {
  //     title: 'NEW ARRIVALS',
  //     backgroundColor: 'bg-teal-300',
  //     width: 'w-full md:w-[calc(_50%_-_0.65rem)]',
  //     height: 'h-[260px]',
  //     imageSrc: '/images/catalog-img-5.svg',
  //     link: '/shop/new',
  //   },
  //   {
  //     title: 'Join OUR COMMUNITY',
  //     backgroundColor: 'bg-amber-300',
  //     width: 'w-full lg:w-[calc(_50%_-_0.65rem)]',
  //     height: 'h-[260px]',
  //     imageSrc: '/images/catalog-img-6.svg',
  //     link: '#',
  //   },
  // ];

  return (
    <div className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
      <Link
        href={'/shop'}
        className={`relative flex h-[175px] w-full grow flex-col justify-center text-2xl font-bold text-white`}
      >
        <div
          className={`relative flex size-full overflow-hidden rounded-3xl bg-amber-600 p-6`}
        >
          <h3 className="z-10 mt-auto uppercase">Catalog</h3>
          <Image
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            src="/images/catalog-img-1.svg"
            alt="Catalog"
            className="absolute left-0 top-0 z-0 size-full rounded-3xl object-cover"
          />
        </div>
      </Link>
      {blocks.map((block, index) => (
        <CatalogCard key={index} cardData={block} />
      ))}
    </div>
  );
};

export default CatalogGrid;
