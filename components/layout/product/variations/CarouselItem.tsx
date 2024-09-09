'use client';

import Image from 'next/image';
import { useState } from 'react';

interface VariationProps {
  title: string;
  imageSrc: string;
}

const CarouselItem: React.FC<VariationProps> = ({ title, imageSrc }) => {
  const [state, setState] = useState(false);
  const onSelect = () => {
    console.log(title);
    setState(true);
  };

  return (
    <button
      onClick={onSelect}
      className={
        'relative box-border flex w-1/4 shrink-0 flex-col ' + state
          ? 'rounded-lg border border-solid border-slate-100'
          : ''
      }
    >
      <div className="flex max-w-[80px] flex-col gap-1 overflow-hidden whitespace-nowrap text-center text-sm text-slate-300">
        <div className="h-[80px] w-full bg-neutral-100">
          <Image
            width={80}
            height={80}
            src={imageSrc}
            alt="Product"
            className="size-full shrink-0 rounded-lg object-cover"
          />
        </div>
        <h3 className="w-full text-center leading-4">{title}</h3>
      </div>
    </button>
  );
};

export default CarouselItem;
