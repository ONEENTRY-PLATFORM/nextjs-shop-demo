/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import FilterHeader from './FilterHeader';
import FiltersForm from './FiltersForm';

function ModalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { open, setOpen, component } = useContext(OpenDrawerContext);

  return (
    <div className="flex w-[550px] flex-col rounded-3xl overflow-hidden bg-white shadow-xl">
      <FilterHeader />
      <FiltersForm />
    </div>
  );
}

export default ModalLayout;
