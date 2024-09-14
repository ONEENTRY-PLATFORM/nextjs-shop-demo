import type { FC, Key } from 'react';

import CategoryCard from './CategoryCard';

interface CategoriesGridProps {
  categories: [];
}

const CategoriesGrid: FC<CategoriesGridProps> = ({ categories }) => {
  return (
    <div className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
      {categories.map((category: { title: string; link: string }, i: Key) => {
        return <CategoryCard key={i} category={category} />;
      })}
    </div>
  );
};

export default CategoriesGrid;
