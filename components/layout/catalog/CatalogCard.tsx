import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { title, backgroundColor, imageSrc, width, height, link } = cardData;

  return (
    <Link
      href={link}
      className="relative flex grow flex-col justify-center text-2xl font-bold text-white"
    >
      <div
        className={`flex w-full p-6 text-2xl font-bold text-white ${backgroundColor} ${height} overflow-hidden rounded-3xl max-md:px-5 max-md:pt-10`}
      >
        <h2 className="z-10 mt-auto">{title}</h2>
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
