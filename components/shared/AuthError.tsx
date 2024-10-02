'use client';

import { useContext, useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

const AuthError = () => {
  const { setOpen, setComponent } = useContext(OpenDrawerContext);
  const { log_in_text } = useAppSelector(
    (state) => state.systemContentReducer.content,
  );
  const [logInText, setLogInText] = useState('');

  useEffect(() => {
    if (log_in_text) {
      setLogInText(log_in_text.value);
    }
  }, [log_in_text]);

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
        {logInText}
      </button>
    </div>
  );
};

export default AuthError;
