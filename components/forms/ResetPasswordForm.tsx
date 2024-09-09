import React from 'react';

import { resetPasswordFormFields } from '../data';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';

const ResetPasswordForm: React.FC = () => {
  const onResetSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // !!!
  };
  return (
    <form
      name="resetPasswordForm"
      className="mx-auto flex min-h-full w-full max-w-[430px] flex-col gap-4 text-xl leading-5"
      onSubmit={onResetSubmit}
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
          return (
            <FormInput
              listTitles={[]}
              position={0}
              type={''}
              validators={{}}
              key={index}
              {...field}
            />
          );
        })}
      </div>

      <FormSubmitButton title="CHANGE PASSWORD" isLoading={false} />
    </form>
  );
};

export default ResetPasswordForm;
