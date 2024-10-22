import type { FC, Key } from 'react';

import CategoriesGridAnimations from './CategoriesGridAnimations';
import CategoryCard from './CategoryCard';

interface CategoryCardProps {
  title: string;
  link: string;
  imgSrc: string;
}

interface CategoriesGridProps {
  categories: CategoryCardProps[];
}

const CategoriesGrid: FC<CategoriesGridProps> = ({ categories }) => {
  return (
    <CategoriesGridAnimations className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
      {categories.map((category: CategoryCardProps, i: Key) => {
        return <CategoryCard key={i} category={category} />;
      })}
    </CategoriesGridAnimations>
  );
};

export default CategoriesGrid;
