'use client';

import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import SignInEmail from '@/components/forms/SignInEmail';

type ModalProps = {
  modal: {
    title: string;
    description: string;
  };
};

function Modal(props: ModalProps) {
  const { modal } = props;
  const { open, setOpen } = useContext(OpenDrawerContext);

  if (!open) {
    return null;
  }

  const onButtonClick = () => {
    setOpen(false);
  };

  return (
    <div className="flex absolute left-0 top-0 h-screen w-full bg-slate-500 bg-opacity-60">
      <div className="bg-white p-10 w-full max-w-96 m-auto">
        <span className="size-5" onClick={onButtonClick}>
          &#10005;
        </span>
        <h1>{modal.title}</h1>
        <p>{modal.description}</p>
        <SignInEmail />
        <button type="button" onClick={onButtonClick}>
          Do something
        </button>
      </div>
    </div>
  );
}

export default Modal;
