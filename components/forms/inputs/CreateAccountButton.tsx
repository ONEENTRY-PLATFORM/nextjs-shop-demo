'use client';

import type { FC } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

interface CreateAccountButtonProps {
  title: string;
}

/**
 * Create account button
 * @param title
 *
 * @returns Create account button
 */
const CreateAccountButton: FC<CreateAccountButtonProps> = ({ title }) => {
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  return (
    <button
      onClick={() => {
        setOpen(true);
        setComponent('SignUpForm');
      }}
      type="button"
      className="slide-up btn btn-lg btn-o btn-o-primary mx-auto w-[280px] border-2 leading-6"
    >
      {title}
    </button>
  );
};

export default CreateAccountButton;
