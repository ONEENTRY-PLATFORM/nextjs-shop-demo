/* eslint-disable @typescript-eslint/no-unused-vars */
import type { IAttributes } from 'oneentry/dist/base/utils';
import type { FC, Key } from 'react';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { logInUser, useGetFormByMarkerQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import { socialProvidersButtons } from '../data';
import Loader from '../shared/Loader';
import CreateAccountButton from './inputs/CreateAccountButton';
import ErrorMessage from './inputs/ErrorMessage';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';
import ResetPasswordButton from './inputs/ResetPasswordButton';
import SocialSignInButton from './inputs/SocialSignInButton';

const SignInForm: FC<{ lang: string }> = ({ lang }) => {
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
  } = useAppSelector((state) => state.systemContentReducer.content);

  const [resetText, setResetText] = useState<string>('');
  const [forgotText, setForgotText] = useState<string>('');
  const [createAccountText, setAccountText] = useState<string>('');
  const [signInText, setSignInText] = useState<string>('');
  const [signInWithText, setSignInWithText] = useState<string>('');

  const { email_reg, password_reg } = useAppSelector(
    (state) => state.formFieldsReducer.fields,
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

  const onSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
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

  useEffect(() => {
    if (reset_password_text) {
      setResetText(reset_password_text.value);
    }
    if (forgot_password_text) {
      setForgotText(forgot_password_text.value);
    }
    if (create_account_text) {
      setAccountText(create_account_text.value);
    }
    if (sign_in_text) {
      setSignInText(sign_in_text.value);
    }
    if (sign_in_with_text) {
      setSignInWithText(sign_in_with_text.value);
    }
  }, [
    reset_password_text,
    forgot_password_text,
    create_account_text,
    sign_in_text,
    sign_in_with_text,
  ]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <form
      className="mx-auto flex min-h-full w-full max-w-[430px] flex-col gap-4 text-xl leading-5"
      onSubmit={(e) => onSignIn(e)}
    >
      <div className="relative box-border flex shrink-0 flex-col gap-2.5">
        <h2 className="max-w-full text-xl font-bold text-neutral-600">
          {signInText}
        </h2>

        <div className="max-w-full text-xs text-gray-400">
          <button
            onClick={() => {
              setTab('email');
            }}
            className={tab === 'email' ? 'font-bold' : ''}
          >
            {/* !!! email_text */}
            E-mail
          </button>
          /
          <button
            onClick={() => {
              setTab('phone');
            }}
            className={tab === 'phone' ? 'font-bold' : ''}
          >
            {/* !!! phone_text */}
            Phone
          </button>
        </div>
      </div>

      <div className="relative mb-4 box-border flex shrink-0 flex-col gap-4">
        {formFields?.map((field: IAttributes, index: Key) => {
          if (field.marker === 'email_reg' && tab === 'email') {
            return <FormInput key={index} {...field} />;
          }
          if (field.marker === 'phone_reg' && tab === 'phone') {
            return <FormInput key={index} {...field} />;
          }
          if (field.marker === 'password_reg') {
            return <FormInput key={index} {...field} />;
          }
        })}
      </div>

      <FormSubmitButton title={signInText} isLoading={loading} />

      <div className="mx-auto mb-5 flex w-[380px] max-w-full justify-center gap-5 text-sm">
        <div className="font-bold text-gray-800">{forgotText}</div>
        <ResetPasswordButton title={resetText} />
      </div>
      <p className="mx-auto mb-3 text-base font-bold leading-8 text-neutral-600">
        {signInWithText}
      </p>
      <div className="mx-auto flex justify-between gap-5">
        {socialProvidersButtons.map((button, index) => (
          <SocialSignInButton
            key={index}
            imageSrc={button.src}
            alt={button.alt}
          />
        ))}
      </div>
      <CreateAccountButton title={createAccountText} />
      {error && <ErrorMessage error={error} />}
    </form>
  );
};

export default SignInForm;
