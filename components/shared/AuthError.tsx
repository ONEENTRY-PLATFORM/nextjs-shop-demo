'use client';

import { useContext, useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

const AuthError = () => {
  const { setOpen, setComponent } = useContext(OpenDrawerContext);
  const [logInText, setLogInText] = useState('');
  const [authRequiredText, setRequiredText] = useState('');
  const { log_in_text, auth_required_text } = useAppSelector(
    (state) => state.systemContentReducer.content,
  );

  useEffect(() => {
    if (log_in_text) {
      setLogInText(log_in_text.value);
    }
    if (auth_required_text) {
      setRequiredText(auth_required_text.value);
    }
  }, [log_in_text, auth_required_text]);

  return (
    <div className="flex w-full flex-col items-center">
      <h1 className="mb-6 text-6xl text-slate-700">401</h1>
      <p className="mb-6 text-2xl text-slate-700">{authRequiredText}</p>
      <button
        onClick={() => {
          setOpen(true);
          setComponent('SignInForm');
        }}
        type="button"
        className="btn btn-sm btn-o btn-o-primary mx-auto w-auto"
      >
        {logInText}
      </button>
    </div>
  );
};

export default AuthError;
