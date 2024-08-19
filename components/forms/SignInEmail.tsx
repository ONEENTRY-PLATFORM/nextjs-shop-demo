// import type { ISignUpData } from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import React, { useContext } from 'react';

// import { logInUser } from '@/app/api';
import { useGetForm } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';

// import { addField } from '@/app/store/reducers/FormFieldsSlice';
import { signInFormFields } from '../data';
import { socialProvidersButtons } from '../data';
import CreateAccountButton from './inputs/CreateAccountButton';
import ForgotPasswordButton from './inputs/ForgotPasswordButton';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';
import ResetPasswordButton from './inputs/ResetPasswordButton';
import SocialSignInButton from './inputs/SocialSignInButton';

const SignInEmail: React.FC = () => {
  const form = useGetForm({
    marker: 'reg',
  });

  return (
    <form className="flex min-h-full flex-col gap-4 text-xl leading-5">
      <div className="relative box-border flex shrink-0 flex-col gap-2.5">
        <h2 className="max-w-full text-xl font-bold text-neutral-600">
          Sign in
        </h2>
        <p className="max-w-full text-xs text-gray-400">E-mail/Phone</p>
      </div>

      <div className="relative mb-8 box-border flex shrink-0 flex-col gap-4">
        {signInFormFields.map((field, index) => {
          return (
            <div key={index}>
              <FormInput {...field} />
            </div>
          );
        })}
      </div>

      <FormSubmitButton title="SIGN IN" class="" icon="" />

      <div className="mx-auto mb-5 flex w-[280px] max-w-full justify-between gap-5 text-sm max-md:mt-10">
        <ForgotPasswordButton title="Forgot Password?" icon={''} class={''} />
        <ResetPasswordButton title="Reset password" icon={''} class={''} />
      </div>

      <p className="mx-auto mb-5 text-base font-bold leading-8 text-neutral-600">
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

      <CreateAccountButton title="Create AN Account" icon={''} class={''} />
    </form>
  );
};

export default SignInEmail;
