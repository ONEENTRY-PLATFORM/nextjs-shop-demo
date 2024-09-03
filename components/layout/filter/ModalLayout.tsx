'use client';

import React, { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import FilterHeader from './FilterHeader';
import FiltersForm from './FiltersForm';

const ModalLayout = () => {
  const { open, component } = useContext(OpenDrawerContext);

  if (!open || !component || component !== 'FilterForm') {
    return null;
  }

  return (
    <div className="fixed right-0 top-10 z-20 flex w-[400px] flex-col overflow-hidden rounded-l-3xl bg-white shadow-xl">
      <FilterHeader />
      <FiltersForm />
    </div>
  );
};

export default ModalLayout;
