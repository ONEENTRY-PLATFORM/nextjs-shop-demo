/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import CalendarForm from '@/components/forms/CalendarForm';
import ForgotPasswordForm from '@/components/forms/ForgotPasswordForm';
import PaymentForm from '@/components/forms/PaymentForm';
import ResetPasswordForm from '@/components/forms/ResetPasswordForm';
import SignInEmail from '@/components/forms/SignInEmail';
import SignInPhone from '@/components/forms/SignInPhone';
import SignUpForm from '@/components/forms/SignUpForm';
import VerificationForm from '@/components/forms/VerificationForm';

function Modal() {
  const { open, setOpen, component } = useContext(OpenDrawerContext);

  if (!open) {
    return null;
  }

  const onButtonClick = () => {
    setOpen(false);
  };

  return (
    <div className="fixed left-0 top-0 z-50 flex h-screen w-full bg-slate-500/60 backdrop-blur-md">
      <div className="relative m-auto w-full max-w-96 overflow-hidden rounded-xl bg-white p-10">
        <button
          className="absolute right-8 top-4 size-5"
          onClick={onButtonClick}
        >
          &#10005;
        </button>
        {component === 'SignInEmail' && <SignInEmail />}
      </div>
    </div>
  );
}

export default Modal;
