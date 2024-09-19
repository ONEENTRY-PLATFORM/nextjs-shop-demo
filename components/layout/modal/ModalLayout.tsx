'use client';
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Fragment, useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import * as forms from '../../forms/';
import CloseModal from './CloseModal';

function Modal() {
  const { open, setOpen, component } = useContext(OpenDrawerContext);
  const closeModal = () => setOpen(false);

  const Form = forms[component as keyof typeof forms] || null;

  if (
    !open ||
    !component ||
    component === ('FilterForm' || 'MobileMenu') ||
    !Form
  ) {
    return null;
  }

  return (
    <Transition show={open}>
      <Dialog
        onClose={closeModal}
        className="relative z-50 flex h-screen w-full"
      >
        <TransitionChild
          as={Fragment}
          enter="transition-all ease-in-out duration-300"
          enterFrom="opacity-0 backdrop-blur-none"
          enterTo="opacity-100 backdrop-blur-[5px]"
          leave="transition-all ease-in-out duration-200"
          leaveFrom="opacity-100 backdrop-blur-[5px]"
          leaveTo="opacity-0 backdrop-blur-none"
        >
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-[5px]"
            aria-hidden="true"
          />
        </TransitionChild>
        <TransitionChild
          as={Fragment}
          enter="transition-all ease-in-out duration-300"
          enterFrom="scale-x-[200%]"
          enterTo="scale-x-[50%]"
          leave="transition-all ease-in-out duration-200"
          leaveFrom="scale-x-[50%]"
          leaveTo="scale-x-[200%]"
        >
          <DialogPanel className="fixed left-1/2 top-1/2 z-20 flex size-full max-w-full -translate-x-1/2 -translate-y-1/2 flex-col overflow-auto bg-white p-6 pt-12 shadow-xl md:overflow-hidden md:rounded-3xl lg:h-auto lg:w-[550px] lg:p-10">
            <CloseModal />
            <Form />
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

export default Modal;
