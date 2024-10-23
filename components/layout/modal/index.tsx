'use client';

import type { FC } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import ModalAnimations from '@/components/layout/modal/animations/ModalAnimations';

import * as forms from '../../forms';
import ModalBackdrop from './components/ModalBackdrop';
import CloseModal from './components/CloseModal';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Modal: FC<{ lang: string; dict: any }> = ({ lang, dict }) => {
  const { component } = useContext(OpenDrawerContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Form: FC<{ className: string; lang: string; dict: any }> =
    forms[component as keyof typeof forms] || null;

  if (!Form) {
    return null;
  }

  return (
    <ModalAnimations>
      <div
        id="modalBody"
        className="fixed left-1/2 top-1/2 z-20 flex size-full max-w-full -translate-x-1/2 -translate-y-1/2 flex-col overflow-auto bg-white p-6 pt-12 shadow-xl md:overflow-hidden md:rounded-3xl lg:h-auto lg:w-[550px] lg:p-10"
      >
        <CloseModal />
        <Form className={''} lang={lang} dict={dict} />
      </div>
      <ModalBackdrop />
    </ModalAnimations>
  );
};

export default Modal;
