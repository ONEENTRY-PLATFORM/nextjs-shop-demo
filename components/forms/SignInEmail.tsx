// import type { ISignUpData } from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import React, { useContext, useEffect } from 'react';

import { logInUser, useGetForm } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

// import { useAppSelector } from '@/app/store/hooks';
import { signInFormFields, socialProvidersButtons } from '../data';
import Loader from '../shared/Loader';
import CreateAccountButton from './inputs/CreateAccountButton';
import ForgotPasswordButton from './inputs/ForgotPasswordButton';
import FormInput from './inputs/FormInput';
import ResetPasswordButton from './inputs/ResetPasswordButton';
import SocialSignInButton from './inputs/SocialSignInButton';

const SignInEmail: React.FC = () => {
  const { authenticate } = useContext(AuthContext);
  const { isAuth, isLoading } = useContext(AuthContext);
  const { setOpen } = useContext(OpenDrawerContext);
  // const form = useGetForm({
  //   marker: 'sign_in',
  // });
  // console.log(form);

  const fields = useAppSelector(
    (state) => state.formFieldsReducer.fields,
  ) as unknown as {
    email_reg: {
      value: string;
    };
    password_reg: {
      value: string;
    };
  };

  if (!fields) {
    return;
  }

  if (isLoading) {
    return <Loader />;
  }

  const onSignIn = async (e: unknown) => {
    e.preventDefault();
    // const login = 'kvasssukr.net@gmail.com';
    // const password = '3hdjxjcjfj1';
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
      setOpen(!isAuth);
      authenticate();
    } catch (e: unknown) {
      console.log(e);
    }
  };

  return (
    <form
      className="flex min-h-full flex-col gap-4 text-xl leading-5"
      onSubmit={(e) => onSignIn(e)}
    >
      <div className="relative box-border flex shrink-0 flex-col gap-2.5">
        <h2 className="max-w-full text-xl font-bold text-neutral-600">
          Sign in
        </h2>
        <p className="max-w-full text-xs text-gray-400">E-mail/Phone</p>
      </div>

      <div className="relative mb-4 box-border flex shrink-0 flex-col gap-4">
        {signInFormFields.map((field, index) => {
          return <FormInput key={index} {...field} />;
        })}
      </div>

      <button
        type="submit"
        className="mt-auto flex w-[282px] max-w-full items-center justify-center self-center rounded-[30px] border border-none border-[black] bg-orange-500 px-5 py-4 text-base font-medium uppercase text-white max-md:mt-10 max-md:px-5"
      >
        Sign in
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
      <Loader />
      <CreateAccountButton title="Create account" icon={''} class={''} />
    </form>
  );
};

export default SignInEmail;
