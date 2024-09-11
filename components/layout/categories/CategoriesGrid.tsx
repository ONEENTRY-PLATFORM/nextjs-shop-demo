/* eslint-disable @typescript-eslint/no-unused-vars */
import { notFound } from 'next/navigation';
import type { Key } from 'react';
import { Suspense } from 'react';

import { getAttributeByMarker, getPageByUrl } from '@/app/api/serverSideProps';
import Loader from '@/components/shared/Loader';

import CategoryCard from './CategoryCard';

const CategoriesGrid: React.FC<{ categories: [] }> = ({ categories }) => {
  return (
    <div className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
      {categories.map((category: { title: string; link: string }, i: Key) => {
        return <CategoryCard key={i} category={category} />;
      })}
    </div>
  );
};

export default CategoriesGrid;
