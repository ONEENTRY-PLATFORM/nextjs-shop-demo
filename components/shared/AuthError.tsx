'use client';

import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

const AuthError = () => {
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  return (
    <div className="flex max-w-64 flex-col">
      <h1 className="mb-6 text-2xl text-slate-700">Auth error</h1>
      <button
        onClick={() => {
          setOpen(true);
          setComponent('SignInForm');
        }}
        type="button"
        className="btn btn-sm btn-o btn-o-primary mr-auto w-auto"
      >
        Log in
      </button>
    </div>
  );
};

export default AuthError;
