import React, { useContext, useState } from 'react';

import { api } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import { resetPasswordFormFields } from '../data';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';

const ResetPasswordForm: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const { email_reg, password_reg, password_confirm, otp_code } =
    useAppSelector((state) => state.formFieldsReducer.fields) as object as {
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
      otp_code: {
        value: number;
        valid: boolean;
      };
    };
  const { setComponent, setAction } = useContext(OpenDrawerContext);

  const onResetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const result = await api.AuthProvider.changePassword(
        'email',
        email_reg.value,
        1,
        otp_code.value.toString(),
        password_reg.value,
        password_confirm.value,
      );
      if (result) {
        setComponent('SignInForm');
        setAction('');
      }
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log(e);
      setLoading(false);
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

      <FormSubmitButton title="CHANGE PASSWORD" isLoading={isLoading} />
    </form>
  );
};

export default ResetPasswordForm;
