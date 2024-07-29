import React from 'react';

interface VariationCardProps {
  title: string; 
  imageSrc: string 
}

const VariationCard: React.FC<VariationCardProps> = ({ title, imageSrc }) => {
  return (
    <article className="flex flex-col gap-2 text-sm text-center whitespace-nowrap max-w-[80px] text-slate-300">
      <div className="w-full rounded-xl bg-neutral-100 min-h-[93px]">
        <img
          src={imageSrc}
          alt="Product"
          className="shrink-0 h-full w-full"
        />
      </div>
      <h3 className="w-full leading-4">
        {title}
      </h3>
    </article>
  );
};

export default VariationCard;