'use client';

import type { IAttributes, IAttributeValues } from 'oneentry/dist/base/utils';
import type { FormEvent, JSX, Key } from 'react';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { logInUser, useGetFormByMarkerQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import FormAnimations from '@/components/forms/animations/FormAnimations';
import FormFieldAnimations from '@/components/forms/animations/FormFieldAnimations';

import CreateAccountButton from './inputs/CreateAccountButton';
import ErrorMessage from './inputs/ErrorMessage';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';
import ResetPasswordButton from './inputs/ResetPasswordButton';

/**
 * SignInForm component that handles user authentication
 *
 * This component renders a sign-in form with email/phone and password fields.
 * It supports switching between email and phone number authentication methods,
 * handles form submission, and integrates with the authentication context.
 * The form includes animations, error handling, and links to related actions
 * such as password reset and account creation.
 * @param   {object}           props      - Component properties.
 * @param   {string}           props.lang - Current language shortcode.
 * @param   {IAttributeValues} props.dict - Dictionary of localized strings from server API.
 * @returns {JSX.Element}                 Sign-in form with email/phone and password fields
 */
const SignInForm = ({
  lang,
  dict,
}: {
  lang: string;
  dict: IAttributeValues;
}): JSX.Element => {
  const { authenticate } = useContext(AuthContext);
  const { setOpen } = useContext(OpenDrawerContext);

  const [tab, setTab] = useState<string>('email');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const {
    reset_password_text,
    forgot_password_text,
    create_account_text,
    sign_in_text,
    email_text,
    phone_text,
  } = dict;

  /** Get form by marker with RTK */
  const { data, isLoading } = useGetFormByMarkerQuery({
    marker: 'reg',
    lang,
  });

  /** get fields from formFieldsReducer */
  const { email_reg, password_reg } = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: { formFieldsReducer: { fields: any } }) =>
      state.formFieldsReducer.fields,
  );

  /** sort fields by position */
  const formFields = data?.attributes
    .slice()
    .sort((a: IAttributes, b: IAttributes) => a.position - b.position);

  /**
   * Handles the sign-in form submission
   *
   * This function validates the form data, sends authentication request to the API,
   * and handles success or error responses. On successful authentication, it updates
   * the authentication context and closes the modal.
   * @param   {FormEvent<HTMLFormElement>} e - Form submission event
   * @returns {Promise<void>}                Promise that resolves when the form submission is complete.
   */
  const onSignIn = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!email_reg || !password_reg) {
      return;
    }

    try {
      setLoading(true);
      const result = await logInUser({
        login: email_reg.value,
        password: password_reg.value,
      });
      if (result && result.error) {
        setError(result.error);
        throw new Error(result.error);
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
        className="mx-auto flex min-h-full w-full max-w-107.5 flex-col gap-4 text-xl leading-5"
        onSubmit={(e) => onSignIn(e)}
      >
        <div className="relative box-border flex shrink-0 flex-col gap-2.5">
          <FormFieldAnimations
            index={0}
            className="max-w-full text-xl font-bold text-neutral-600"
          >
            <h2>{sign_in_text?.value}</h2>
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
              {email_text?.value}
            </button>
            /
            <button
              onClick={() => {
                setTab('phone');
              }}
              className={tab === 'phone' ? 'font-bold' : ''}
            >
              {phone_text?.value}
            </button>
          </FormFieldAnimations>
        </div>

        <div className="relative mb-4 box-border flex shrink-0 flex-col gap-4">
          {formFields?.map((field: IAttributes, index: Key | number) => {
            if (field.marker === 'email_reg' && tab === 'email') {
              return (
                <FormInput
                  key={index}
                  index={2}
                  {...field}
                  value={field.value}
                />
              );
            }
            if (field.marker === 'phone_reg' && tab === 'phone') {
              return (
                <FormInput
                  key={index}
                  index={3}
                  {...field}
                  value={field.value}
                />
              );
            }
            if (field.marker === 'password_reg') {
              return (
                <FormInput
                  key={index}
                  index={4}
                  {...field}
                  value={field.value}
                />
              );
            }
            return;
          })}
        </div>

        <FormSubmitButton
          index={5}
          title={sign_in_text?.value}
          isLoading={loading}
        />

        <FormFieldAnimations
          index={6}
          className="mx-auto mb-5 flex w-95 max-w-full justify-center gap-5 text-sm"
        >
          <div className="font-bold text-gray-800">
            {forgot_password_text?.value}
          </div>
          <ResetPasswordButton title={reset_password_text?.value} />
        </FormFieldAnimations>
        <FormFieldAnimations index={7} className="w-full">
          <CreateAccountButton title={create_account_text?.value} />
        </FormFieldAnimations>
        {error && <ErrorMessage error={error} />}
      </form>
    </FormAnimations>
  );
};

export default SignInForm;
