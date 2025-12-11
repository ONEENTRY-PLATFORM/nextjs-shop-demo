'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import ModalAnimations from '@/components/layout/modal/animations/ModalAnimations';

import * as forms from '../../forms';
import CloseModal from './components/CloseModal';
import ModalBackdrop from './components/ModalBackdrop';

/**
 * Forms modal component.
 * Renders a modal dialog containing a form component based on the current context.
 * @param   {object}           props      - Component props
 * @param   {string}           props.lang - Current language shortcode (e.g., 'en', 'ru')
 * @param   {IAttributeValues} props.dict - Dictionary data from server API for form labels and messages
 * @returns {JSX.Element}                 Modal with form component
 */
const Modal = ({
  lang,
  dict,
}: {
  lang: string;
  dict: IAttributeValues;
}): JSX.Element => {
  /** Access the component name from the OpenDrawerContext to determine which form to display */
  const { component } = useContext(OpenDrawerContext);

  const cn =
    component === 'ReviewModal'
      ? 'lg:w-[980px] lg:h-[70vh]'
      : 'lg:w-[550px] lg:h-auto';

  /** Dynamically select the form component based on the component name from context */
  const Form = forms[component as keyof typeof forms] || null;

  /** Don't render anything if no form component is found */
  if (!Form) {
    return <></>;
  }

  /** Render the modal with animations and the selected form component */
  return (
    <ModalAnimations component={component}>
      {/* Modal body container with positioning and styling */}
      <div
        id="modalBody"
        className={
          'fixed left-1/2 top-1/2 z-20 flex size-full max-w-full -translate-x-1/2 -translate-y-1/2 flex-col overflow-auto bg-white p-6 pt-12 shadow-xl md:overflow-hidden md:rounded-3xl lg:p-10 ' +
          cn
        }
      >
        {/* Close button for the modal */}
        <CloseModal />
        {/* Render the selected form component with provided props */}
        <Form className={''} lang={lang} dict={dict} />
      </div>
      {/* Backdrop overlay for the modal */}
      <ModalBackdrop />
    </ModalAnimations>
  );
};

export default Modal;
