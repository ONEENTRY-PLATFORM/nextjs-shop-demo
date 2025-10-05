import { Baloo_2 as Baloo } from 'next/font/google';
import Link from 'next/link';
import type { JSX } from 'react';

import OptimizedImage from '@/components/shared/OptimizedImage';

import CategoryAnimations from '../animations/CategoryAnimations';

const baloo = Baloo({
  subsets: ['latin'],
  weight: ['400', '800'],
});

/**
 * Category card.
 * @param   {object}      props                 - props.
 * @param   {object}      props.category        - category object.
 * @param   {string}      props.category.title  - category title.
 * @param   {string}      props.category.link   - category link.
 * @param   {unknown}     props.category.imgSrc - category image source.
 * @param   {number}      props.index           - index of element in array for stagger.
 * @returns {JSX.Element}                       category card with animations.
 */
const CategoryCard = ({
  category: { imgSrc, title, link },
  index,
}: {
  category: {
    imgSrc: unknown;
    title: string;
    link: string;
  };
  index: number;
}): JSX.Element => {
  return (
    <CategoryAnimations
      className={`${baloo.className} block-card group relative flex w-1/4 grow flex-col justify-center overflow-hidden rounded-3xl text-2xl font-bold text-white transition-shadow duration-500 hover:shadow-xl max-md:w-full`}
      index={index}
    >
      <Link
        href={link}
        className="relative flex size-full h-64 bg-slate-100 p-6"
      >
        <h2 className="z-10 mt-auto uppercase">{title}</h2>
        <OptimizedImage
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          src={imgSrc ? imgSrc : '/images/card.svg'}
          alt={title}
          quality={75}
          className="absolute left-0 top-0 z-0 size-full rounded-3xl object-cover transition-all duration-500 group-hover:scale-125"
        />
        <div className="radial-hover"></div>
      </Link>
    </CategoryAnimations>
  );
};

export default CategoryCard;
