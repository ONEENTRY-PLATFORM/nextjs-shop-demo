'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FormEvent, JSX, Key } from 'react';
import { useCallback, useContext, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import {
  AUTH_PROVIDER_MARKER_KEY,
  DEFAULT_AUTH_PROVIDER,
  logInUser,
  useGetFormByMarkerQuery,
} from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import { getApiErrorMessage } from '@/app/utils/getApiErrorMessage';
import FormAnimations from '@/components/forms/animations/FormAnimations';
import FormFieldAnimations from '@/components/forms/animations/FormFieldAnimations';

import CreateAccountButton from './inputs/CreateAccountButton';
import ErrorMessage from './inputs/ErrorMessage';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';
import GoogleSignInButton from './inputs/GoogleSignInButton';
import ResetPasswordButton from './inputs/ResetPasswordButton';
import { getFormAttributes } from './utils/getFormAttributes';

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

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const {
    reset_password_text,
    forgot_password_text,
    create_account_text,
    sign_in_text,
    google_sign_in_text,
  } = dict;

  /** Localized label for the Google OAuth button, with a safe fallback. */
  const googleLabel =
    (google_sign_in_text?.value as string) || 'Sign in with Google';

  /** Get form by marker with RTK */
  const { data, isLoading } = useGetFormByMarkerQuery({
    marker: 'reg',
    lang,
  });

  /** get fields from formFieldsReducer */
  const fields = useAppSelector((state) => state.formFieldsReducer.fields);

  /**
   * Sort fields by position (memoized)
   * This ensures fields are displayed in the correct order
   */
  const formFields = useMemo(() => {
    const attributes = getFormAttributes(data);
    return attributes.length > 0
      ? attributes.sort((a, b) => a.position - b.position)
      : undefined;
  }, [data]);

  /**
   * Login field resolved by its SDK flag (`isLogin === true`), NOT by marker
   * name (auth-provider rule); the marker-name fallback covers forms whose
   * flags are not configured in the admin panel (mismatch-log C.2.3).
   */
  const loginField = useMemo(
    () =>
      formFields?.find((field) => field.isLogin === true) ??
      formFields?.find((field) => field.marker === 'email_reg'),
    [formFields],
  );

  /** Password field resolved by its SDK flag (`isPassword === true`), same fallback. */
  const passwordField = useMemo(
    () =>
      formFields?.find((field) => field.isPassword === true) ??
      formFields?.find((field) => field.marker === 'password_reg'),
    [formFields],
  );

  /** Current values of the credential fields from the Redux form state */
  const email_reg = fields[loginField?.marker ?? 'email_reg'];
  const password_reg = fields[passwordField?.marker ?? 'password_reg'];

  /**
   * Handles the sign-in form submission
   *
   * This function validates the form data, sends authentication request to the API,
   * and handles success or error responses. On successful authentication, it updates
   * the authentication context and closes the modal.
   * @param   {FormEvent<HTMLFormElement>} e - Form submission event
   * @returns {Promise<void>}                Promise that resolves when the form submission is complete.
   */
  const onSignIn = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      if (!email_reg || !password_reg) {
        return;
      }

      try {
        setLoading(true);
        const result = await logInUser({
          login: String(email_reg.value),
          password: String(password_reg.value),
          ...(loginField?.marker && { loginMarker: loginField.marker }),
          ...(passwordField?.marker && {
            passwordMarker: passwordField.marker,
          }),
        });
        if (result && result.error) {
          setError(result.error);
        } else if (result?.data?.refreshToken) {
          /**
           * `auth()` has already persisted both tokens via the SDK's
           * saveFunction — only the provider marker needs saving so the
           * proactive refresh hits the right provider route (tokens rule).
           */
          localStorage.setItem(AUTH_PROVIDER_MARKER_KEY, DEFAULT_AUTH_PROVIDER);
          setOpen(false);
          authenticate();
          setError('');
          toast('You sign in!');
        } else {
          setError('Login or password is incorrect. Please try again.');
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
        setError(getApiErrorMessage(e));
      }
    },
    [email_reg, password_reg, loginField, passwordField, setOpen, authenticate],
  );

  return (
    <FormAnimations isLoading={isLoading || !formFields}>
      <form
        className="mx-auto flex min-h-full w-full max-w-107.5 flex-col gap-4 text-xl leading-5"
        onSubmit={onSignIn}
      >
        <div className="relative box-border flex shrink-0 flex-col gap-2.5">
          <FormFieldAnimations
            index={0}
            className="max-w-full text-xl font-bold text-neutral-600"
          >
            <h2>{sign_in_text?.value as string}</h2>
          </FormFieldAnimations>
        </div>

        <div className="relative mb-4 box-border flex shrink-0 flex-col gap-4">
          {formFields?.map((field, index: Key | number) => {
            if (field.marker === 'email_reg') {
              return (
                <FormInput
                  key={field.marker || index}
                  index={1}
                  {...field}
                  value={(field.value as string | number | undefined) ?? ''}
                />
              );
            }
            if (field.marker === 'password_reg') {
              return (
                <FormInput
                  key={field.marker || index}
                  index={2}
                  {...field}
                  value={(field.value as string | number | undefined) ?? ''}
                />
              );
            }
            return;
          })}
        </div>

        <FormSubmitButton
          index={3}
          title={sign_in_text?.value as string}
          isLoading={loading}
        />

        <FormFieldAnimations
          index={4}
          className="mx-auto flex w-full max-w-70 items-center gap-3 text-xs text-gray-400"
        >
          <span className="h-px flex-1 bg-gray-200" />
          or
          <span className="h-px flex-1 bg-gray-200" />
        </FormFieldAnimations>

        <GoogleSignInButton index={5} lang={lang} title={googleLabel} />

        <FormFieldAnimations
          index={6}
          className="mx-auto mb-5 flex w-95 max-w-full justify-center gap-5 text-sm"
        >
          <div className="font-bold text-gray-800">
            {forgot_password_text?.value as string}
          </div>
          <ResetPasswordButton title={reset_password_text?.value as string} />
        </FormFieldAnimations>
        <FormFieldAnimations index={7} className="w-full">
          <CreateAccountButton title={create_account_text?.value as string} />
        </FormFieldAnimations>
        {error && <ErrorMessage error={error} />}
      </form>
    </FormAnimations>
  );
};

export default SignInForm;
