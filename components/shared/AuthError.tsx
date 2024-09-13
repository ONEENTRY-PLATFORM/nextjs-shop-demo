'use client';

import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

const AuthError = () => {
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  return (
    <div className="flex flex-col">
      <h1 className="mb-6 text-xl font-bold">Auth error</h1>
      <button
        onClick={() => {
          setOpen(true);
          setComponent('SignInForm');
        }}
        type="button"
        className="text-md mr-auto w-auto rounded-[30px] border border-solid border-orange-500 px-10 py-2 font-bold uppercase text-orange-500 max-md:px-5"
      >
        Log in
      </button>
    </div>
  );
};

export default AuthError;
