import React from 'react';

// import { logInUser } from '@/app/api';
import { socialProvidersButtons } from '../data';
import { signInPhoneFormFields } from '../data';
import CreateAccountButton from './inputs/CreateAccountButton';
import ForgotPasswordButton from './inputs/ForgotPasswordButton';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';
import ResetPasswordButton from './inputs/ResetPasswordButton';
import SocialSignInButton from './inputs/SocialSignInButton';

const SignInPhone: React.FC = () => {
  return (
    <form
      name="signin-form"
      className="flex min-h-full flex-col gap-4 text-xl leading-5"
      method="POST"
    >
      <div className="relative box-border flex shrink-0 flex-col gap-2.5">
        <h2 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
          Sign in
        </h2>
        <p className="text-xs text-gray-400 max-md:max-w-full">
          E-mail/<b>Phone</b>
        </p>
      </div>

      <div className="relative mb-32 box-border flex shrink-0 flex-col gap-4">
        {signInPhoneFormFields.map((field, index) => {
          return (
            <div key={index}>
              <FormInput {...field} />
            </div>
          );
        })}
      </div>

      <FormSubmitButton title="SIGN IN" class="" icon="" />

      <div className="mx-auto mb-2.5 flex w-[280px] max-w-full justify-between gap-5 text-sm max-md:mt-10">
        <ForgotPasswordButton title="Forgot Password?" />
        <ResetPasswordButton title="Reset password" />
      </div>

      <p className="mx-auto mb-2.5 text-base font-bold leading-8 text-neutral-600">
        Sign in with
      </p>

      <div className="mx-auto mb-5 flex justify-between gap-5">
        {socialProvidersButtons.map((button, index) => (
          <SocialSignInButton
            key={index}
            imageSrc={button.src}
            alt={button.alt}
          />
        ))}
      </div>

      <CreateAccountButton title="Create Account" icon={''} class={''} />
    </form>
  );
};

export default SignInPhone;
