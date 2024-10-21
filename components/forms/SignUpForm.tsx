'use client';

import type { ISignUpData } from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import type { IAttributes } from 'oneentry/dist/base/utils';
import type { FC, FormEvent, Key } from 'react';
import { useContext, useState } from 'react';

import FormAnimations from '@/app/animations/FormAnimations';
import { useGetFormByMarkerQuery } from '@/app/api';
import { logInUser } from '@/app/api';
import { api } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import { LanguageEnum } from '@/app/types/enum';

import { typeError } from '../utils';
import ErrorMessage from './inputs/ErrorMessage';
import FormInput from './inputs/FormInput';
import SubmitButton from './inputs/FormSubmitButton';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SignUpForm: FC<{ lang: string; dict: any }> = ({ lang, dict }) => {
  const { authenticate } = useContext(AuthContext);
  const { setOpen, setComponent, setAction } = useContext(OpenDrawerContext);

  const { sign_up_text, sign_in_text, create_account_desc } = dict;

  const { data, isLoading } = useGetFormByMarkerQuery({
    marker: 'reg',
    lang,
  });

  const [loading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

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

  const onSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formFields = [
      'email_reg',
      'password_reg',
      'name_reg',
      'phone_reg',
      'address_reg',
      'email_notifications',
    ];

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
          if (formFields.includes(field)) {
            arr.push(candidate);
          }
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
        const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
        const res = await api.AuthProvider.signUp('email', data, langCode);

        // if user active try login else Verification and activateUser
        if (res && res.isActive) {
          await logInUser({
            method: 'email',
            login: res.identifier,
            password: fields.password_reg.value,
          });
          authenticate();
        } else if (res && !res.isActive && !typeError(res)) {
          setOpen(true);
          setComponent('VerificationForm');
          setAction('activateUser');
        }

        setError('');
        if (typeError(res)) {
          setError('Error ' + res.status);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <FormAnimations isLoading={isLoading}>
      <form
        onSubmit={(e) => onSignUp(e)}
        className="mx-auto flex min-h-full w-full max-w-[430px] flex-col gap-4 text-xl leading-5"
      >
        <div className="relative box-border flex shrink-0 flex-col gap-2.5">
          <h2 className="slide-up text-xl font-bold text-neutral-600 max-md:max-w-full">
            {sign_up_text.value}
          </h2>
          <p className="slide-up text-xs text-gray-400 max-md:max-w-full">
            <button
              onClick={() => {
                setComponent('SignInForm');
              }}
              className="underline"
            >
              {sign_in_text.value}
            </button>{' '}
            {create_account_desc.value}
          </p>
        </div>
        <div className="relative mb-4 box-border flex shrink-0 flex-col gap-4">
          {data?.attributes.map((field: IAttributes, index: Key) => {
            if (field.marker !== 'email_notifications') {
              return <FormInput key={index} {...field} />;
            }
          })}
        </div>
        <SubmitButton
          title={sign_up_text.value}
          isLoading={loading || isLoading}
        />
        {error && <ErrorMessage error={error} />}
      </form>
    </FormAnimations>
  );
};

export default SignUpForm;
