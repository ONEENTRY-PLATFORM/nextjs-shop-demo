import type { IAttributes } from 'oneentry/dist/base/utils';
import type { Key } from 'react';
import React, { useContext } from 'react';

import { api, useGetFormByMarkerQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';

export const ForgotPasswordForm: React.FC = () => {
  const { data, isLoading } = useGetFormByMarkerQuery({ marker: 'reg' });

  const fields = useAppSelector(
    (state) => state.formFieldsReducer.fields,
  ) as object as {
    email_reg: {
      value: string;
      valid: boolean;
    };
  };
  const { setComponent, setAction } = useContext(OpenDrawerContext);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.AuthProvider.generateCode(
        'email',
        fields.email_reg.value,
        'generate_code',
      );
      setComponent('VerificationForm');
      setAction('checkCode');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.statusCode === 400) {
        setComponent('VerificationForm');
      }
    }
  };

  return (
    <form
      className="mx-auto flex min-h-[480px] max-w-[350px] flex-col gap-4 text-xl leading-5"
      onSubmit={(e) => onSubmit(e)}
    >
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
        {data?.attributes.map((field: IAttributes, index: Key) => {
          if (field.marker === 'email_reg') {
            return <FormInput key={index} {...field} />;
          }
        })}
      </div>

      <FormSubmitButton title="SEND" isLoading={isLoading} />
    </form>
  );
};

export default ForgotPasswordForm;
