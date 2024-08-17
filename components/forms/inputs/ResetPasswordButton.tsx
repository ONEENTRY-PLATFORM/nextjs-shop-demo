'use client';

import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

interface ButtonProps {
  title: string;
  icon: string;
  class: string;
}

const ResetPasswordButton: React.FC<ButtonProps> = ({ title }) => {
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  return (
    <button
      onClick={() => {
        setOpen(true);
        setComponent('ResetPasswordForm');
      }}
      type="button"
      className="ml-auto font-bold text-orange-500 underline"
    >
      {title}
    </button>
  );
};

export default ResetPasswordButton;
