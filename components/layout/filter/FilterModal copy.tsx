/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import type { FC } from 'react';
import { Fragment, Suspense, useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import Loader from '@/components/shared/Loader';

import FilterHeader from './components/header/FilterHeader';
import FiltersForm from './FiltersForm';

const FilterModal: FC<{
  prices: any;
  dict: any;
}> = ({ prices, dict }) => {
  const { open, setOpen, component } = useContext(OpenDrawerContext);
  const closeFilters = () => setOpen(false);

  return (
    <Transition show={open && component === 'FilterForm'}>
      <Dialog onClose={closeFilters} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="transition-all ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-all ease-in-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </TransitionChild>
        <TransitionChild
          as={Fragment}
          enter="transition-all ease-in-out duration-300"
          enterFrom="translate-x-[200%]"
          enterTo="translate-x-0"
          leave="transition-all ease-in-out duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-[200%]"
        >
          <DialogPanel className="fixed right-0 top-0 z-20 flex size-full min-h-[90vh] flex-col overflow-auto bg-white shadow-xl md:top-10 md:overflow-hidden md:rounded-l-3xl lg:h-auto lg:w-[380px]">
            <FilterHeader dict={dict} />
            <Suspense fallback={<Loader />}>
              <FiltersForm prices={prices} dict={dict} />
            </Suspense>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
};

export default FilterModal;
