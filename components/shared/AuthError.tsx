'use client';

import type { FC } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuthError: FC<{ dict: any }> = ({ dict }) => {
  const { setOpen, setComponent } = useContext(OpenDrawerContext);
  const { log_in_text, auth_required_text } = dict;

  return (
    <div className="flex w-full flex-col items-center">
      <h1 className="mb-6 text-6xl text-slate-700">401</h1>
      <p className="mb-6 text-2xl text-slate-700">
        {auth_required_text?.value}
      </p>
      <button
        onClick={() => {
          setOpen(true);
          setComponent('SignInForm');
        }}
        type="button"
        className="btn btn-sm btn-o btn-o-primary mx-auto w-auto"
      >
        {log_in_text?.value}
      </button>
    </div>
  );
};

export default AuthError;
