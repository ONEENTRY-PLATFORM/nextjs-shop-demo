import React from 'react';

interface PriceDisplayProps {
  currentPrice: number;
  originalPrice: number;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  currentPrice,
  originalPrice,
}) => {
  return (
    <div className="mb-5 mr-auto flex gap-2 py-1">
      <div className="grow text-lg font-bold leading-4 text-orange-500">
        ${currentPrice}
      </div>
      <div className="text-sm leading-4 text-gray-400">${originalPrice}</div>
    </div>
  );
};

export default PriceDisplay;
