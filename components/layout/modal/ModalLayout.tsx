'use client';

import { useContext, useEffect, useState } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import * as forms from '../../forms/';
import CloseModal from './CloseModal';

function Modal() {
  const { open, setOpen, component } = useContext(OpenDrawerContext);

  if (!open || !component) {
    return null;
  }

  const onButtonClick = () => {
    setOpen(false);
  };
  const Form = forms[component];

  return (
    <div className="fixed left-0 top-0 z-50 flex h-screen w-full bg-slate-500/60 backdrop-blur-md">
      <div className="relative z-10 m-auto w-full max-w-96 overflow-hidden rounded-xl bg-white p-10">
        <CloseModal />
        <Form />
      </div>
      <button
        className="absolute left-0 top-0 z-0 size-full"
        onClick={onButtonClick}
      ></button>
    </div>
  );
}

export default Modal;
