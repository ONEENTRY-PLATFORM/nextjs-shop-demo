// import type { ISignUpData } from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import type { IAttributes } from 'oneentry/dist/base/utils';
import type { Key } from 'react';
import React, { useContext, useState } from 'react';

import {
  logInUser,
  // useGetAuthProvidersQuery,
  useGetFormByMarkerQuery,
} from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

// import { useAppSelector } from '@/app/store/hooks';
import { socialProvidersButtons } from '../data';
import Spinner from '../shared/Spinner';
import CreateAccountButton from './inputs/CreateAccountButton';
import ForgotPasswordButton from './inputs/ForgotPasswordButton';
import FormInput from './inputs/FormInput';
import ResetPasswordButton from './inputs/ResetPasswordButton';
import SocialSignInButton from './inputs/SocialSignInButton';

const SignInForm: React.FC = () => {
  const { authenticate } = useContext(AuthContext);
  const { isAuth } = useContext(AuthContext);
  const { setOpen } = useContext(OpenDrawerContext);
  const { data, isLoading } = useGetFormByMarkerQuery({ marker: 'reg' });
  const [tab, setTab] = useState('email');

  const fields = useAppSelector(
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
    if (!fields) {
      return;
    }
    const login = fields.email_reg?.value;
    const password = fields.password_reg?.value;

    try {
      const result = await logInUser({
        method: 'email',
        login: login,
        password: password,
      });
      if (result.error) {
        throw new Error(result?.error);
      }
      setOpen(false);
      authenticate();
    } catch (e: unknown) {
      // console.log(e);
    }
  };

  const formFields = data?.attributes
    .slice()
    .sort((a: IAttributes, b: IAttributes) => a.position - b.position);

  // if (!isAuth) {
  //   return;
  // }

  return (
    <form
      className="flex min-h-full flex-col gap-4 text-xl leading-5"
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
        type="submit"
        className="relative mt-auto flex w-[282px] max-w-full items-center justify-center self-center rounded-[30px] border border-none border-[black] bg-orange-500 px-5 py-4 text-base font-medium uppercase text-white max-md:mt-10 max-md:px-5"
      >
        {isLoading ? <Spinner /> : 'Sign in'}
      </button>

      <div className="mx-auto mb-5 flex w-[280px] max-w-full justify-between gap-5 text-sm max-md:mt-10">
        <ForgotPasswordButton title="Forgot Password?" />
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
      <CreateAccountButton title="Create account" icon={''} class={''} />
    </form>
  );
};

export default SignInForm;
