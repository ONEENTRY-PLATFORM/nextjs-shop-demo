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
      className="mx-auto w-auto rounded-[30px] border-2 border-solid border-orange-500 px-10 py-3 text-lg font-bold uppercase text-orange-500 max-md:px-5"
    >
      {title}
    </button>
  );
};

export default CreateAccountButton;
