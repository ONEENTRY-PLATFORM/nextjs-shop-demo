'use client';

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import React, { Fragment, useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import FilterHeader from './FilterHeader';
import FiltersForm from './FiltersForm';

const ModalLayout = () => {
  const { open, setOpen, component } = useContext(OpenDrawerContext);
  const closeMobileMenu = () => setOpen(false);

  return (
    <Transition show={open && component === 'FilterForm'}>
      <Dialog onClose={closeMobileMenu} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="transition-all ease-in-out duration-300"
          enterFrom="opacity-0 backdrop-blur-none"
          enterTo="opacity-100 backdrop-blur-[.5px]"
          leave="transition-all ease-in-out duration-200"
          leaveFrom="opacity-100 backdrop-blur-[.5px]"
          leaveTo="opacity-0 backdrop-blur-none"
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
          <DialogPanel className="fixed right-0 top-10 z-20 flex w-[400px] flex-col overflow-hidden rounded-l-3xl bg-white shadow-xl">
            <FilterHeader />
            <FiltersForm />
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
};

export default ModalLayout;
