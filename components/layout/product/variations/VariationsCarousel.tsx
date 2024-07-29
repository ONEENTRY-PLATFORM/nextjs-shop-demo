import React from "react";
import CarouselItem from "./CarouselItem";
import NavigationButton from "./NavigationButton";

const items = [
  {
    title: "Red",
    imageSrc: "./images/catalog-img-4.svg",
  },
  {
    title: "Blue",
    imageSrc: "./images/catalog-img-4.svg",
  },
  {
    title: "Green",
    imageSrc: "./images/catalog-img-4.svg",
  },
  {
    title: "Yellow",
    imageSrc: "./images/catalog-img-4.svg",
  },
];

const VariationsCarousel: React.FC = () => {
  return (
    <nav className="flex gap-3 justify-center items-center self-stretch w-full">
      <NavigationButton direction="left" />
      <div className="flex gap-1.5 self-stretch">
        {items.map((item, idx) => (
          <CarouselItem key={idx} title={item.title} imageSrc={item.imageSrc} />
        ))}
      </div>
      <NavigationButton direction="right" />
    </nav>
  );
};

export default VariationsCarousel;
