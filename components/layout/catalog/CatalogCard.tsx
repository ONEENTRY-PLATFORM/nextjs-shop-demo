import React from 'react';
import Image from "next/image";
import Link from 'next/link';

interface CatalogGridProps {
  cardData: {
    title: string;
    backgroundColor: string;
    imageSrc: string;
    width: string;
    height?: string;
    link: string;
  };
}

const CatalogCard: React.FC<CatalogGridProps> = ({ cardData }) => {
  const {
    title,
    backgroundColor,
    imageSrc,
    width,
    height,
    link,
  } = cardData;

  return (
    <Link href={link} className="flex flex-col grow justify-center text-2xl font-bold text-white relative">
      <div className={`flex p-6 w-full text-2xl font-bold text-white ${backgroundColor} ${height} rounded-3xl overflow-hidden max-md:px-5 max-md:pt-10`}>
        <h2 className="mt-auto z-10">
          {title}
        </h2>
        <Image 
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          src={imageSrc} 
          alt={title} 
          className="absolute top-0 left-0 w-full h-full object-cover z-0 rounded-3xl" 
        />
      </div>
    </Link>
  );
};

export default CatalogCard;