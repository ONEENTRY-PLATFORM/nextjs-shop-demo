import React from 'react';

interface NavigationButtonProps {
  direction: 'left' | 'right';
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ direction }) => {
  const imageSrc = direction === 'left' ? 'L' : 'R';
  const altText = `Navigate ${direction}`;

  return (
    <button className="border border-none border-neutral-200 rounded-full">
      <img 
        loading="lazy" 
        src={imageSrc} 
        alt={altText}
        className="shrink-0 self-stretch my-auto w-7 aspect-square" 
      />
    </button>
  );
};

export default NavigationButton;