'use client';

import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import * as forms from '../../forms/';
import CloseModal from './CloseModal';

function Modal() {
  const { open, setOpen, component } = useContext(OpenDrawerContext);
  const Form = forms[component] || null;

  if (
    !open ||
    !component ||
    component === ('FilterForm' || 'MobileMenu') ||
    !Form
  ) {
    return null;
  }

  return (
    <div className="fixed left-0 top-0 z-50 flex h-screen w-full bg-slate-500/60 backdrop-blur-md">
      <div className="relative z-10 m-auto max-h-full w-[420px] max-w-full overflow-auto rounded-xl bg-white p-10 lg:overflow-x-hidden">
        <CloseModal />
        <Form />
      </div>
      <button
        className="absolute left-0 top-0 z-0 size-full"
        onClick={() => {
          setOpen(false);
        }}
      ></button>
    </div>
  );
}

export default Modal;
