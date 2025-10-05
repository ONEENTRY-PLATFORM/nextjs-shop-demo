import type { JSX, Key } from 'react';

import CategoriesGridAnimations from './animations/CategoriesGridAnimations';
import { CategoriesLoader } from './components/CategoriesLoader';
import CategoryCard from './components/CategoryCard';

interface CategoryCardProps {
  title: string;
  link: string;
  imgSrc: string;
}

/**
 * Categories grid.
 * @param   {object}              props            - categories grid props.
 * @param   {CategoryCardProps[]} props.categories - categories array.
 * @returns {JSX.Element}                          categories grid with animations.
 */
const CategoriesGrid = ({
  categories,
}: {
  categories: CategoryCardProps[];
}): JSX.Element => {
  if (!categories) {
    return <CategoriesLoader />;
  }
  return (
    <CategoriesGridAnimations className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
      {Array.isArray(categories) ? (
        categories.map((category: CategoryCardProps, i: Key) => {
          return (
            <CategoryCard key={i} category={category} index={i as number} />
          );
        })
      ) : (
        <CategoriesLoader />
      )}
    </CategoriesGridAnimations>
  );
};

export default CategoriesGrid;
