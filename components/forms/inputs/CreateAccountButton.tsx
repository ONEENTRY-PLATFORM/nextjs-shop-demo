'use client';

import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

interface CreateAccountButtonProps {
  title: string;
}

const CreateAccountButton: React.FC<CreateAccountButtonProps> = ({ title }) => {
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  return (
    <button
      onClick={() => {
        setOpen(true);
        setComponent('SignUpForm');
      }}
      type="button"
      className="btn btn-lg btn-o btn-o-primary mx-auto w-[280px] border-2 leading-6"
    >
      {title}
    </button>
  );
};

export default CreateAccountButton;
