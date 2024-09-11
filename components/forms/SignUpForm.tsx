import type { ISignUpData } from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import type { IAttributes } from 'oneentry/dist/base/utils';
import React, { useContext, useState } from 'react';

import { useGetFormByMarkerQuery } from '@/app/api';
import { logInUser } from '@/app/api';
import { api } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import FormInput from './inputs/FormInput';
import SubmitButton from './inputs/FormSubmitButton';

const SignUpForm: React.FC = () => {
  const [_isLoading, setIsLoading] = useState<boolean>(false);
  const { data, isLoading } = useGetFormByMarkerQuery({ marker: 'reg' });
  const { authenticate } = useContext(AuthContext);
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  const fields = useAppSelector(
    (state) => state.formFieldsReducer.fields,
  ) as object as {
    phone_reg: {
      value: string;
      valid: boolean;
    };
    email_reg: {
      value: string;
      valid: boolean;
    };
    password_reg: {
      value: string;
      valid: boolean;
    };
  };

  const onSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const canSubmit = Object.keys(fields).reduce((isValid, field) => {
      if (!isValid || !field) {
        return false;
      }
      return fields[field as keyof typeof fields].valid;
    }, true);

    if (canSubmit) {
      const formData = Object.keys(fields).reduce(
        (
          arr: Array<{
            marker: string;
            type: string;
            value: string;
          }>,
          field,
        ) => {
          const candidate = {
            marker: field,
            type: 'string',
            value: fields[field as keyof typeof fields].value,
          };
          arr.push(candidate);
          return arr;
        },
        [],
      );
      formData.push({
        marker: 'email_notifications',
        type: 'string',
        value: fields.email_reg.value,
      });
      const data: ISignUpData = {
        formIdentifier: 'reg',
        authData: [
          { marker: 'email_reg', value: fields.email_reg.value },
          { marker: 'password_reg', value: fields.password_reg.value },
        ],
        formData,
        notificationData: {
          email: fields.email_reg.value,
          phonePush: [fields.phone_reg.value],
          phoneSMS: fields.phone_reg.value,
        },
      };
      setIsLoading(true);

      try {
        const res = await api.AuthProvider.signUp('email', data, 'en_US');
        if (res.isActive) {
          try {
            await logInUser({
              method: 'email',
              login: res.identifier,
              password: fields.password_reg.value,
            });
            authenticate();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (e: any) {
            console.log(e);
          }
        } else {
          setOpen(true);
          setComponent('VerificationForm');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.log(e);
      }
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => onSignUp(e)}
      className="mx-auto flex min-h-full w-full max-w-[430px] flex-col gap-4 text-xl leading-5"
    >
      <div className="relative box-border flex shrink-0 flex-col gap-2.5">
        <h2 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
          Sign up
        </h2>
        <p className="text-xs text-gray-400 max-md:max-w-full">
          Sign in or create account to quickly manage order
        </p>
      </div>
      <div className="relative mb-4 box-border flex shrink-0 flex-col gap-4">
        {data?.attributes.map((field: IAttributes, index: React.Key) => {
          if (field.marker !== 'email_notifications') {
            return <FormInput key={index} {...field} />;
          }
        })}
      </div>
      <SubmitButton title="SIGN UP" isLoading={_isLoading && isLoading} />
    </form>
  );
};

export default SignUpForm;
