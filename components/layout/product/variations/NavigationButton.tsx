import Image from 'next/image';
import React from 'react';

interface NavigationButtonProps {
  direction: 'left' | 'right';
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ direction }) => {
  const imageSrc =
    direction === 'left' ? '/icons/arrow-left.svg' : '/icons/arrow-right.svg';
  const altText = `Navigate ${direction}`;

  return (
    <button
      type="button"
      className="flex aspect-square w-8 items-center justify-center rounded-full border border-neutral-200"
    >
      <Image
        width={16}
        height={16}
        loading="lazy"
        src={imageSrc}
        alt={altText}
        className="my-auto aspect-square w-4 shrink-0 self-stretch"
      />
    </button>
  );
};

export default NavigationButton;
