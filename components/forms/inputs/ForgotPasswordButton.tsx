'use client';

import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

interface ButtonProps {
  title: string;
  icon: string;
  class: string;
}

const ForgotPasswordButton: React.FC<ButtonProps> = ({ title }) => {
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  return (
    <button
      onClick={() => {
        setOpen(true);
        setComponent('ForgotPasswordForm');
      }}
      type="button"
      className="flex-auto font-bold text-gray-400 underline hover:text-orange-500"
    >
      {title}
    </button>
  );
};

export default ForgotPasswordButton;
