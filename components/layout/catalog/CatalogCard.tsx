import React from 'react';
import Image from "next/image";

interface CatalogCardProps {
  title: string;
  backgroundColor: string;
  imageSrc: string;
  height?: string;
}

const CatalogCard: React.FC<CatalogCardProps> = ({ title, backgroundColor, imageSrc, height }) => (
  <div className={`flex p-6 w-full text-2xl font-bold text-white ${backgroundColor} ${height} rounded-3xl overflow-hidden max-md:px-5 max-md:pt-10`}>
    <span className="mt-auto z-10">{title}</span>
    <Image 
      fill
      sizes="(min-width: 1024px) 66vw, 100vw"
      src={imageSrc} 
      alt="" 
      className="absolute top-0 left-0 w-full h-full object-cover z-0 rounded-3xl" 
    />
  </div>
);

export default CatalogCard;