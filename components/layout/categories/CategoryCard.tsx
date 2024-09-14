import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';

interface CategoryCardProps {
  category: { title: string; link: string };
}

const CategoryCard: FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      href={category.link}
      className="relative flex w-1/4 grow flex-col justify-center text-2xl font-bold text-white max-md:w-full"
    >
      <div
        className={`relative flex size-full h-64 overflow-hidden rounded-3xl p-6`}
      >
        <h2 className="z-10 mt-auto uppercase">{category.title}</h2>
        <Image
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          src={'/images/card.svg'}
          alt={category.title}
          className="size-full rounded-3xl object-cover"
        />
      </div>
    </Link>
  );
};

export default CategoryCard;
