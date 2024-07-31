import React from "react";
import CatalogCard from "./CatalogCard";

interface CardData {
  title: string;
  backgroundColor: string;
  imageSrc: string;
  width: string;
  height?: string;
}

interface CatalogGridProps {
  cards: CardData[];
}

const CatalogGrid: React.FC<CatalogGridProps> = ({ cards }) => (
  <div className="flex gap-5 max-md:flex-col flex-wrap justify-between">
    {cards.map((card, index) => (
      <div
        key={index}
        className={`flex flex-col ${card.width} max-md:w-full`}
      >
        <a href="#" className="flex flex-col grow justify-center text-2xl font-bold text-white relative">
          <CatalogCard
            title={card.title}
            backgroundColor={card.backgroundColor}
            imageSrc={card.imageSrc}
            height={card.height}
          />
        </a>
      </div>
    ))}
  </div>
);

export default CatalogGrid;
