import type { FC } from 'react';
import React, { useContext, useEffect, useState } from 'react';

import { api } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import { resetPasswordFormFields } from '../data';
import ErrorMessage from './inputs/ErrorMessage';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ResetPasswordForm: FC<{ lang: string }> = ({ lang }) => {
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
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState('');

  const { reset_password_text, new_password_desc, change_password_text } =
    useAppSelector((state) => state.systemContentReducer.content);

  const [resetText, setResetText] = useState<string>('');
  const [newPassText, setNewPassText] = useState<string>('');
  const [changeText, setChangeText] = useState<string>('');

  useEffect(() => {
    if (reset_password_text) {
      setResetText(reset_password_text.value);
    }
    if (new_password_desc) {
      setNewPassText(new_password_desc.value);
    }
    if (change_password_text) {
      setChangeText(change_password_text.value);
    }
  }, [reset_password_text, new_password_desc, change_password_text]);

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
      setError(e.message);
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
          {resetText}
        </h2>
        <p className="max-w-full text-xs text-gray-400">{newPassText}</p>
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

      <FormSubmitButton title={changeText} isLoading={isLoading} />
      {isError && <ErrorMessage error={isError} />}
    </form>
  );
};

export default ResetPasswordForm;
