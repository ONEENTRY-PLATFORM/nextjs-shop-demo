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
      link: '/catalog',
    },
    {
      title: 'BEST SELLER',
      backgroundColor: 'bg-purple-600',
      width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
      imageSrc: '/images/catalog-img-2.svg',
      link: '/catalog/best',
    },
    {
      title: 'PROMOTION',
      backgroundColor: 'bg-blue-500',
      width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
      imageSrc: '/images/catalog-img-3.svg',
      link: '/catalog/promotion',
    },
    {
      title: 'OFFER OF TODAY',
      backgroundColor: 'bg-lime-700',
      width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
      imageSrc: '/images/catalog-img-4.svg',
      link: '/catalog/offer',
    },
    {
      title: 'NEW ARRIVALS',
      backgroundColor: 'bg-teal-300',
      width: 'w-full md:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
      imageSrc: '/images/catalog-img-5.svg',
      link: '/catalog/new',
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
  // const stickersData = await getAttributeByMarker({
  //   attributeMarker: 'stickers',
  //   setMarker: 'product',
  //   langCode: 'en_US',
  // });

  // const stickerAdds = {
  //   colors: ['bg-purple-600', 'bg-blue-500', 'bg-lime-700', 'bg-teal-300'],
  //   width: [
  //     'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
  //     'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
  //     'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
  //     'w-full md:w-[calc(_50%_-_0.65rem)]',
  //   ],
  //   imageSrc: [
  //     '/images/catalog-img-2.svg',
  //     '/images/catalog-img-3.svg',
  //     '/images/catalog-img-4.svg',
  //     '/images/catalog-img-5.svg',
  //   ],
  // };

  // const stickers = stickersData.attribute?.listTitles.map(
  //   (sticker: { title: string; value: string }, i: number) => {
  //     return {
  //       title: sticker.title,
  //       backgroundColor: stickerAdds.colors[i],
  //       width: stickerAdds.width[i],
  //       height: 'h-[260px]',
  //       imageSrc: stickerAdds.imageSrc[i],
  //       link: '/catalog/' + sticker.value,
  //     };
  //   },
  // );

  // const catalogCards = [
  //   {
  //     title: 'Catalog',
  //     backgroundColor: 'bg-amber-600',
  //     width: 'w-full',
  //     height: 'h-[175px]',
  //     imageSrc: '/images/catalog-img-1.svg',
  //     link: '/catalog',
  //   },
  // ];
  // catalogCards.push(stickers);
  // catalogCards.push({
  //   title: 'Join OUR COMMUNITY',
  //   backgroundColor: 'bg-amber-300',
  //   width: 'w-full lg:w-[calc(_50%_-_0.65rem)]',
  //   height: 'h-[260px]',
  //   imageSrc: '/images/catalog-img-6.svg',
  //   link: '#',
  // });

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
