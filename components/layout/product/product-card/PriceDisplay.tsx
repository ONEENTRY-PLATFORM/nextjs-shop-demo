import React from 'react';

interface PriceDisplayProps {
  currentPrice: number;
  originalPrice: number;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  currentPrice,
  originalPrice,
}) => {
  if (!currentPrice && !originalPrice) {
    return;
  }
  return (
    <div className="flex gap-2.5 self-center font-bold">
      {currentPrice && (
        <div className="text-lg leading-6 text-orange-500">
          $ {currentPrice}
        </div>
      )}
      <div
        className={
          'leading-6 ' +
          (currentPrice ? 'text-slate-300 text-sm' : 'text-orange-500 text-lg')
        }
      >
        $ {originalPrice}
      </div>
    </div>
  );
};

export default PriceDisplay;
