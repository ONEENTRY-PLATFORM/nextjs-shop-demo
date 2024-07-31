import React from 'react';
import CatalogGrid from '../catalog/CatalogGrid';

const cards = [
  { 
    title: 'BEST SELLER', 
    backgroundColor: 'bg-amber-600', 
    width: 'w-full',
    height: 'h-[175px]',
    imageSrc: './images/catalog-img-1.svg',
    link: ''
  },
  { 
    title: 'BEST SELLER', 
    backgroundColor: 'bg-purple-600', 
    width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
    height: 'h-[260px]',
    imageSrc: './images/catalog-img-2.svg',
    link: ''
  },
  { 
    title: 'PROMOTION', 
    backgroundColor: 'bg-blue-500', 
    width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
    height: 'h-[260px]',
    imageSrc: './images/catalog-img-3.svg',
    link: ''
  },
  { 
    title: 'OFFER OF TODAY', 
    backgroundColor: 'bg-lime-700', 
    width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
    height: 'h-[260px]',
    imageSrc: './images/catalog-img-4.svg',
    link: ''
  },
  { 
    title: 'NEW\nARRIVALS', 
    backgroundColor: 'bg-teal-300', 
    width: 'w-full md:w-[calc(_50%_-_0.65rem)]',
    height: 'h-[260px]',
    imageSrc: './images/catalog-img-5.svg',
    link: ''
  },
  {
    title: 'Join OUR COMMUNITY',
    backgroundColor: 'bg-amber-300',
    width: 'w-full lg:w-[calc(_50%_-_0.65rem)]',
    height: 'h-[260px]',
    imageSrc: './images/catalog-img-6.svg',
    link: ''
  },
];

const CatalogPage: React.FC = () => {

  return (
    <section className="box-border flex relative flex-col grow shrink-0 self-stretch mx-auto w-full max-w-[1240px]">
      <div className="flex flex-col gap-5 items-center w-full bg-white">
        <CatalogGrid cards={cards} />
      </div>
    </section>
  );
};

export default CatalogPage;