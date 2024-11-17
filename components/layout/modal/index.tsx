'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FC } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import ModalAnimations from '@/components/layout/modal/animations/ModalAnimations';

import * as forms from '../../forms';
import CloseModal from './components/CloseModal';
import ModalBackdrop from './components/ModalBackdrop';

/**
 * Forms modal component
 * @param lang Current language shortcode
 * @param dict dictionary from server api
 *
 * @componentType Client component
 * @returns Modal with form component
 */
const Modal: FC<{ lang: string; dict: IAttributeValues }> = ({
  lang,
  dict,
}) => {
  const { component } = useContext(OpenDrawerContext);

  // select form component by component name
  const Form: FC<{ className: string; lang: string; dict: IAttributeValues }> =
    forms[component as keyof typeof forms] || null;

  if (!Form) {
    return null;
  }

  return (
    <ModalAnimations component={component}>
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
