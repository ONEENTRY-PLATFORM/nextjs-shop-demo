import type { FC, Key } from 'react';

import CategoriesGridAnimations from './animations/CategoriesGridAnimations';
import { CategoriesLoader } from './components/CategoriesLoader';
import CategoryCard from './components/CategoryCard';

interface CategoryCardProps {
  title: string;
  link: string;
  imgSrc: string;
}

interface CategoriesGridProps {
  categories: CategoryCardProps[];
}

/**
 * Categories grid
 * @param categories
 *
 * @returns categories grid with animations
 */
const CategoriesGrid: FC<CategoriesGridProps> = ({ categories }) => {
  if (!categories) {
    return <CategoriesLoader />;
  }
  return (
    <CategoriesGridAnimations className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
      {categories.map((category: CategoryCardProps, i: Key) => {
        return <CategoryCard key={i} category={category} index={i as number} />;
      })}
    </CategoriesGridAnimations>
  );
};

export default CategoriesGrid;
