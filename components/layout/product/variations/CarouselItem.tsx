import React from "react";
import VariationCard from "./VariationCard";

interface VariationProps {
  title: string;
  imageSrc: string;
}

const CarouselItem: React.FC<VariationProps> = ({ title, imageSrc }) => {
  return (
    <div className="box-border flex relative flex-col shrink-0 w-20">
      <VariationCard title={title} imageSrc={imageSrc} />
    </div>
  );
};

export default CarouselItem;
