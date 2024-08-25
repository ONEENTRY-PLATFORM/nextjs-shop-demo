import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface CatalogCardProps {
  cardData: {
    title: string;
    backgroundColor: string;
    imageSrc: string;
    link: string;
  };
}

const CatalogCard: React.FC<CatalogCardProps> = ({ cardData }) => {
  const { title, backgroundColor, imageSrc, link } = cardData;

  return (
    <Link
      href={link}
      className="relative flex grow flex-col justify-center text-2xl font-bold text-white"
    >
      <div
        className={`relative flex size-full p-6 ${backgroundColor} overflow-hidden rounded-3xl`}
      >
        <h3 className="z-10 mt-auto uppercase">{title}</h3>
        <Image
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          src={imageSrc}
          alt={title}
          className="absolute left-0 top-0 z-0 size-full rounded-3xl object-cover"
        />
      </div>
    </Link>
  );
};

export default CatalogCard;
