import React from 'react';

import { getAttributeByMarker } from '@/app/api/serverSideProps';

import CatalogCard from './CatalogCard';

const CatalogGrid: React.FC = async () => {
  const catalogCards = [
    {
      title: 'Catalog',
      backgroundColor: 'bg-amber-600',
      width: 'w-full',
      height: 'h-[175px]',
      imageSrc: '/images/catalog-img-1.svg',
      link: '/shop',
    },
    {
      title: 'BEST SELLER',
      backgroundColor: 'bg-purple-600',
      width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
      imageSrc: '/images/catalog-img-2.svg',
      link: '/shop/best',
    },
    {
      title: 'PROMOTION',
      backgroundColor: 'bg-blue-500',
      width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
      imageSrc: '/images/catalog-img-3.svg',
      link: '/shop/promotion',
    },
    {
      title: 'OFFER OF TODAY',
      backgroundColor: 'bg-lime-700',
      width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
      imageSrc: '/images/catalog-img-4.svg',
      link: '/shop/offer',
    },
    {
      title: 'NEW ARRIVALS',
      backgroundColor: 'bg-teal-300',
      width: 'w-full md:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
      imageSrc: '/images/catalog-img-5.svg',
      link: '/shop/new',
    },
    {
      title: 'Join OUR COMMUNITY',
      backgroundColor: 'bg-amber-300',
      width: 'w-full lg:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
      imageSrc: '/images/catalog-img-6.svg',
      link: '#',
    },
  ];

  return (
    <div className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
      {catalogCards.map((card, index) => (
        <div
          key={index}
          className={`flex flex-col ${card.width} ${card.height}`}
        >
          <CatalogCard cardData={card} />
        </div>
      ))}
    </div>
  );
};

export default CatalogGrid;
