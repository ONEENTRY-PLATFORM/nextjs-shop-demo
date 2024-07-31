import React from "react";
import Card from "./Card";

interface CardData {
  title: string;
  backgroundColor: string;
  imageSrc: string;
  width: string;
  height?: string;
}

interface CardGridProps {
  cards: CardData[];
}

const CardGrid: React.FC<CardGridProps> = ({ cards }) => (
  <div className="flex gap-5 max-md:flex-col flex-wrap justify-between">
    {cards.map((card, index) => (
      <div
        key={index}
        className={`flex flex-col ${card.width} max-md:ml-0 max-md:w-full`}
      >
        <div className="flex flex-col grow justify-center text-2xl font-bold text-white max-md:mt-5 relative">
          <Card
            title={card.title}
            backgroundColor={card.backgroundColor}
            imageSrc={card.imageSrc}
            height={card.height}
          />
        </div>
      </div>
    ))}
  </div>
);

export default CardGrid;
