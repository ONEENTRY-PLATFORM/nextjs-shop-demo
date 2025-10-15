import type { JSX, Key } from 'react';

import CategoriesGridAnimations from './animations/CategoriesGridAnimations';
import { CategoriesLoader } from './components/CategoriesLoader';
import CategoryCard from './components/CategoryCard';

/**
 * Category card props.
 */
interface CategoryCardProps {
  title: string;
  link: string;
  imgSrc: string;
}

/**
 * Categories grid component that displays a grid of category cards with animations
 * Handles loading states and renders category cards with staggered animations
 * @param   {object}              props            - categories grid props
 * @param   {CategoryCardProps[]} props.categories - array of category objects to display
 * @returns {JSX.Element}                          categories grid with entrance/exit animations
 */
const CategoriesGrid = ({
  categories,
}: {
  categories: CategoryCardProps[];
}): JSX.Element => {
  /** Show loader if categories data is not available */
  if (!categories) {
    return <CategoriesLoader />;
  }

  return (
    /** Wrap categories grid with animation component for page transition effects */
    <CategoriesGridAnimations className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
      {Array.isArray(categories) ? (
        /** Render category cards with staggered animations if categories is an array */
        categories.map((category: CategoryCardProps, i: Key) => {
          return (
            /** Each category card receives its index for staggered animation timing */
            <CategoryCard key={i} category={category} index={i as number} />
          );
        })
      ) : (
        /** Show loader if categories is not an array */
        <CategoriesLoader />
      )}
    </CategoriesGridAnimations>
  );
};

export default CategoriesGrid;
