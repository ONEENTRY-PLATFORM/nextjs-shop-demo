/* eslint-disable @typescript-eslint/no-unused-vars */
import type { IAttributes } from 'oneentry/dist/base/utils';
import type { FC, Key } from 'react';
import React, { useContext, useState } from 'react';

import { logInUser, useGetFormByMarkerQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import { socialProvidersButtons } from '../data';
import Loader from '../shared/Loader';
import Spinner from '../shared/Spinner';
import CreateAccountButton from './inputs/CreateAccountButton';
// import ForgotPasswordButton from './inputs/ForgotPasswordButton';
import FormInput from './inputs/FormInput';
import ResetPasswordButton from './inputs/ResetPasswordButton';
import SocialSignInButton from './inputs/SocialSignInButton';

const SignInForm: FC = () => {
  const { authenticate } = useContext(AuthContext);
  const { isAuth } = useContext(AuthContext);
  const { setOpen } = useContext(OpenDrawerContext);
  const { data, isLoading } = useGetFormByMarkerQuery({ marker: 'reg' });
  const [tab, setTab] = useState('email');
  const [loading, setLoading] = useState(false);

  const { email_reg, password_reg } = useAppSelector(
    (state) => state.formFieldsReducer.fields,
  ) as object as {
    email_reg: {
      value: string;
    };
    password_reg: {
      value: string;
    };
  };

  const onSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email_reg || !password_reg) {
      return;
    }
    const login = email_reg.value;
    const password = password_reg.value;

    try {
      setLoading(true);
      const result = await logInUser({
        method: 'email',
        login: login,
        password: password,
      });
      setLoading(false);
      if (result.error) {
        throw new Error(result?.error);
      }
      setOpen(false);
      authenticate();
    } catch (e: unknown) {
      setLoading(false);
      console.log(e);
    }
  };

  const formFields = data?.attributes
    .slice()
    .sort((a: IAttributes, b: IAttributes) => a.position - b.position);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <form
      className="mx-auto flex min-h-full w-full max-w-[430px] flex-col gap-4 text-xl leading-5"
      onSubmit={(e) => onSignIn(e)}
    >
      <div className="relative box-border flex shrink-0 flex-col gap-2.5">
        <h2 className="max-w-full text-xl font-bold text-neutral-600">
          Sign in
        </h2>

        <div className="max-w-full text-xs text-gray-400">
          <button
            onClick={() => {
              setTab('email');
            }}
            className={tab === 'email' ? 'font-bold' : ''}
          >
            E-mail
          </button>
          /
          <button
            onClick={() => {
              setTab('phone');
            }}
            className={tab === 'phone' ? 'font-bold' : ''}
          >
            Phone
          </button>
        </div>
      </div>

      <div className="relative mb-4 box-border flex shrink-0 flex-col gap-4">
        {formFields?.map((field: IAttributes, index: Key) => {
          if (field.marker === 'email_reg' && tab === 'email') {
            return <FormInput key={index} {...field} />;
          }
          if (field.marker === 'phone_reg' && tab === 'phone') {
            return <FormInput key={index} {...field} />;
          }
          if (field.marker === 'password_reg') {
            return <FormInput key={index} {...field} />;
          }
        })}
      </div>

      <button
        disabled={isLoading || loading}
        type="submit"
        className="relative mt-auto flex w-full max-w-[280px] items-center justify-center self-center rounded-[30px] bg-orange-500 px-5 py-4 text-base font-medium uppercase text-white max-md:mt-10 max-md:px-5"
      >
        {isLoading || loading ? <Spinner /> : 'Sign in'}
      </button>

      <div className="mx-auto mb-5 flex w-[280px] max-w-full justify-between gap-5 text-sm">
        <div className="font-bold text-gray-800">Forgot Password?</div>
        {/* <ForgotPasswordButton title="Forgot Password?" /> */}
        <ResetPasswordButton title="Reset password" />
      </div>

      <p className="mx-auto mb-3 text-base font-bold leading-8 text-neutral-600">
        Sign in with
      </p>
      <div className="mx-auto flex justify-between gap-5">
        {socialProvidersButtons.map((button, index) => (
          <SocialSignInButton
            key={index}
            imageSrc={button.src}
            alt={button.alt}
          />
        ))}
      </div>

      <CreateAccountButton title="Create account" />
    </form>
  );
};

export default SignInForm;
