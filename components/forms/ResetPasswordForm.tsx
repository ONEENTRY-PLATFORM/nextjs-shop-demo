import React from 'react';

import { resetPasswordFormFields } from '../data';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';

const ResetPasswordForm: React.FC = () => {
  return (
    <form
      name="resetPasswordForm"
      className="flex min-h-full flex-col gap-4 text-xl leading-5"
      method="POST"
    >
      <div className="relative box-border flex shrink-0 flex-col gap-2.5">
        <h2 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
          Reset password
        </h2>
        <p className="text-xs text-gray-400 max-md:max-w-full">
          Enter new password and confirm.
        </p>
      </div>

      <div className="relative mb-8 box-border flex shrink-0 flex-col gap-4">
        {resetPasswordFormFields.map((field, index) => {
          return <FormInput key={index} {...field} />;
        })}
      </div>

      <FormSubmitButton title="CHANGE PASSWORD" class="" icon="" />
    </form>
  );
};

export default ResetPasswordForm;
