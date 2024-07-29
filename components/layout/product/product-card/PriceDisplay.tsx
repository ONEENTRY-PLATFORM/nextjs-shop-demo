import React from "react";

interface PriceDisplayProps {
  currentPrice: number;
  originalPrice: number;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  currentPrice,
  originalPrice,
}) => {
  return (
    <div className="flex gap-2.5 self-center font-bold">
      <div className="text-lg leading-6 text-orange-500">$ {currentPrice}</div>
      <div className="text-sm leading-6 text-slate-300">$ {originalPrice}</div>
    </div>
  );
};

export default PriceDisplay;
