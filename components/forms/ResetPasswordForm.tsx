import React, { useContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { api } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';

import { resetPasswordFormFields } from '../data';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

const ResetPasswordForm: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { email_reg, password_reg, password_confirm } = useAppSelector(
    (state) => state.formFieldsReducer.fields,
  ) as object as {
    email_reg: {
      value: string;
      valid: boolean;
    };
    password_confirm: {
      value: string;
      valid: boolean;
    };
    password_reg: {
      value: string;
      valid: boolean;
    };
  };
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  const onResetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setComponent('ForgotPasswordForm');

    try {
      // const result = await api.AuthProvider.changePassword(
      //   'email',
      //   email_reg.value,
      //   2,
      //   code,
      //   password_reg.value,
      //   password_confirm.value,
      // );
      // console.log(result);
      // if (result) {
      //   // navigateAuth('auth_sign_in', { method: 'email' });
      // }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <form
      name="resetPasswordForm"
      className="mx-auto flex min-h-full w-full max-w-[430px] flex-col gap-4 text-xl leading-5"
      onSubmit={onResetSubmit}
    >
      <div className="relative box-border flex shrink-0 flex-col gap-2.5">
        <h2 className="max-w-full text-xl font-bold text-neutral-600">
          Reset password
        </h2>
        <p className="max-w-full text-xs text-gray-400">
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
