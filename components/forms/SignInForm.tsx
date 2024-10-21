'use client';

import type { IAttributes } from 'oneentry/dist/base/utils';
import type { FC, FormEvent, Key } from 'react';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import FormAnimations from '@/app/animations/FormAnimations';
import FormFieldAnimations from '@/app/animations/FormFieldAnimations';
import { logInUser, useGetFormByMarkerQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import { socialProvidersButtons } from '../data';
import CreateAccountButton from './inputs/CreateAccountButton';
import ErrorMessage from './inputs/ErrorMessage';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';
import ResetPasswordButton from './inputs/ResetPasswordButton';
import SocialSignInButton from './inputs/SocialSignInButton';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SignInForm: FC<{ lang: string; dict: any }> = ({ lang, dict }) => {
  const { authenticate } = useContext(AuthContext);
  const { setOpen } = useContext(OpenDrawerContext);

  const { data, isLoading } = useGetFormByMarkerQuery({
    marker: 'reg',
    lang,
  });

  const [tab, setTab] = useState<string>('email');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const {
    reset_password_text,
    forgot_password_text,
    create_account_text,
    sign_in_text,
    sign_in_with_text,
    email_text,
    phone_text,
  } = dict;

  const { email_reg, password_reg } = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: { formFieldsReducer: { fields: any } }) =>
      state.formFieldsReducer.fields,
  ) as object as {
    email_reg: {
      value: string;
    };
    password_reg: {
      value: string;
    };
  };

  const formFields = data?.attributes
    .slice()
    .sort((a: IAttributes, b: IAttributes) => a.position - b.position);

  const onSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email_reg || !password_reg) {
      return;
    }

    try {
      setLoading(true);
      const result = await logInUser({
        method: 'email',
        login: email_reg.value,
        password: password_reg.value,
      });
      if (result && result.error) {
        if ('accessToken'.indexOf(result.error) === -1) {
          throw new Error('User not activated.');
        } else {
          throw new Error(result.error);
        }
      } else if (result) {
        setOpen(false);
        authenticate();
        setError('');
        toast('You sign in!');
      } else {
        setError('Login or password incorrect');
      }
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setLoading(false);
      setError(e.message);
    }
  };

  return (
    <FormAnimations isLoading={isLoading || !formFields}>
      <form
        className="mx-auto flex min-h-full w-full max-w-[430px] flex-col gap-4 text-xl leading-5"
        onSubmit={(e) => onSignIn(e)}
      >
        <div className="relative box-border flex shrink-0 flex-col gap-2.5">
          <FormFieldAnimations
            index={0}
            className="max-w-full text-xl font-bold text-neutral-600"
          >
            <h2>{sign_in_text.value}</h2>
          </FormFieldAnimations>

          <FormFieldAnimations
            index={1}
            className="max-w-full text-xs text-gray-400"
          >
            <button
              onClick={() => {
                setTab('email');
              }}
              className={tab === 'email' ? 'font-bold' : ''}
            >
              {email_text.value}
            </button>
            /
            <button
              onClick={() => {
                setTab('phone');
              }}
              className={tab === 'phone' ? 'font-bold' : ''}
            >
              {phone_text.value}
            </button>
          </FormFieldAnimations>
        </div>

        <div className="relative mb-4 box-border flex shrink-0 flex-col gap-4">
          {formFields?.map((field: IAttributes, index: Key | number) => {
            if (field.marker === 'email_reg' && tab === 'email') {
              return <FormInput key={index} index={2} {...field} />;
            }
            if (field.marker === 'phone_reg' && tab === 'phone') {
              return <FormInput key={index} index={3} {...field} />;
            }
            if (field.marker === 'password_reg') {
              return <FormInput key={index} index={4} {...field} />;
            }
          })}
        </div>

        <FormFieldAnimations index={5} className="w-full">
          <FormSubmitButton title={sign_in_text.value} isLoading={loading} />
        </FormFieldAnimations>

        <FormFieldAnimations
          index={6}
          className="mx-auto mb-5 flex w-[380px] max-w-full justify-center gap-5 text-sm"
        >
          <div className="font-bold text-gray-800">
            {forgot_password_text.value}
          </div>
          <ResetPasswordButton title={reset_password_text.value} />
        </FormFieldAnimations>

        <FormFieldAnimations index={7} className="w-full">
          <p className="mx-auto mb-3 text-center text-base font-bold leading-8 text-neutral-600">
            {sign_in_with_text.value}
          </p>
        </FormFieldAnimations>
        <FormFieldAnimations
          index={8}
          className="mx-auto flex max-w-32 justify-between gap-5"
        >
          {socialProvidersButtons.map((button, index) => (
            <SocialSignInButton
              key={index}
              imageSrc={button.src}
              alt={button.alt}
            />
          ))}
        </FormFieldAnimations>
        <FormFieldAnimations index={9} className="w-full">
          <CreateAccountButton title={create_account_text.value} />
        </FormFieldAnimations>
        {error && <ErrorMessage error={error} />}
      </form>
    </FormAnimations>
  );
};

export default SignInForm;
