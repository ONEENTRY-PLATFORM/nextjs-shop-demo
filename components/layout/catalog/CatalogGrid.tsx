import React from 'react';

import CatalogCard from './CatalogCard';

interface CardData {
  title: string;
  backgroundColor: string;
  imageSrc: string;
  width: string;
  height?: string;
  link: string;
}

interface CatalogGridProps {
  cards: CardData[];
}

const CatalogGrid: React.FC<CatalogGridProps> = ({ cards }) => (
  <div className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
    {cards.map((card, index) => (
      <div key={index} className={`flex flex-col ${card.width} ${card.height}`}>
        <CatalogCard cardData={card} />
      </div>
    ))}
  </div>
);

export default CatalogGrid;
