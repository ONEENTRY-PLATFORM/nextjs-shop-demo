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
    <div className="flex gap-2 py-1 mr-auto mb-5">
      <div className="grow text-lg font-bold text-orange-500 leading-4">
        ${currentPrice}
      </div>
      <div className="text-sm leading-4 text-gray-400">
        ${originalPrice}
      </div>
    </div>
  );
};

export default PriceDisplay;
