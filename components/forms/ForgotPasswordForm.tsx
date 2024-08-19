import React from 'react';

import { forgotPasswordFormFields } from '../data';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';

export const ForgotPasswordForm: React.FC = () => {
  return (
    <form className="flex min-h-[480px] flex-col gap-4 text-xl leading-5">
      <div className="relative box-border flex shrink-0 flex-col gap-2.5">
        <h2 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
          Forgot password
        </h2>

        <p className="text-xs text-gray-400 max-md:max-w-full">
          Please enter your email address. You will receive a link to create a
          new password via email.
        </p>
      </div>

      <div className="relative mb-8 box-border flex shrink-0 flex-col gap-4">
        {forgotPasswordFormFields.map((field, index) => {
          return (
            <div key={index}>
              <FormInput {...field} />
            </div>
          );
        })}
      </div>

      <FormSubmitButton title="SEND" class="" icon="" />
    </form>
  );
};

export default ForgotPasswordForm;
