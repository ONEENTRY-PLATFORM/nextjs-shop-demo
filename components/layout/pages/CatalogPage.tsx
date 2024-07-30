import React from 'react';
import CardGrid from './CardGrid';

const cards = [
  { 
    title: 'BEST SELLER', 
    backgroundColor: 'bg-amber-600', 
    width: 'w-full',
    height: 'h-[175px]',
  },
  { 
    title: 'BEST SELLER', 
    backgroundColor: 'bg-purple-600', 
    width: 'w-[calc(_33%_-_0.65rem)]',
    height: 'h-[260px]',
  },
  { 
    title: 'PROMOTION', 
    backgroundColor: 'bg-blue-500', 
    width: 'w-[calc(_33%_-_0.65rem)]',
    height: 'h-[260px]',
  },
  { 
    title: 'OFFER OF TODAY', 
    backgroundColor: 'bg-lime-700', 
    width: 'w-[calc(_33%_-_0.65rem)]',
    height: 'h-[260px]',
  },
  { 
    title: 'NEW\nARRIVALS', 
    backgroundColor: 'bg-teal-300', 
    width: 'w-[calc(_50%_-_0.65rem)]',
    height: 'h-[260px]',
  },
  {
    title: 'Join OUR COMMUNITY',
    backgroundColor: 'bg-amber-300',
    width: 'w-[calc(_50%_-_0.65rem)]',
    height: 'h-[260px]',
  },
];

const CatalogPage: React.FC = () => {

  return (
    <section className="box-border flex relative flex-col grow shrink-0 self-stretch mx-auto w-full max-w-[1240px]">
      <div className="flex flex-col gap-5 items-center w-full bg-white">
        <CardGrid cards={cards} />
      </div>
    </section>
  );
};

export default CatalogPage;