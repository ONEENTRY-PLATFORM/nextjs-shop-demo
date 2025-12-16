/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FormEvent, JSX } from 'react';
import { useContext, useState } from 'react';

import { api } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import FormAnimations from '@/components/forms/animations/FormAnimations';

import ErrorMessage from './inputs/ErrorMessage';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';

/**
 * Form field configurations for the reset password form
 *
 * This array defines the structure and properties of form fields used in
 * the reset password functionality. Each field includes type, visibility,
 * localization, placeholder, marker, and required status information.
 * @type {Array<object>}
 */
export const resetPasswordFormFields = [
  {
    fieldType: 'password',
    isVisible: true,
    localizeInfos: {
      title: 'Password',
    },
    placeholder: '•••••',
    marker: 'password_reg',
    required: true,
  },
  {
    fieldType: 'password',
    isVisible: true,
    localizeInfos: {
      title: 'Confirm password',
    },
    placeholder: '•••••',
    marker: 'password_confirm',
    required: true,
  },
];

/**
 * Reset password form component that allows users to set a new password.
 * This component renders a form for users to enter and confirm a new password
 * after successfully verifying their identity through the OTP process.
 * It handles form submission and communicates with the authentication API
 * to update the user's password.
 * @param   {object}           props      - Component properties
 * @param   {IAttributeValues} props.dict - Dictionary with localized values from server API
 * @returns {JSX.Element}                 Reset password form component with validation and submission handling
 */
const ResetPasswordForm = ({
  dict,
}: {
  dict: IAttributeValues;
}): JSX.Element => {
  /** Get form fields from Redux state (email, OTP code, passwords) */
  const { email_reg, password_reg, password_confirm, otp_code } =
    useAppSelector((state) => state.formFieldsReducer.fields);
  /** Modal context for controlling form modal state */
  const { setComponent, setAction } = useContext(OpenDrawerContext);
  /** State for managing loading status during form submission */
  const [isLoading, setLoading] = useState(false);
  /** State for storing error messages */
  const [isError, setError] = useState('');

  /** Extract localized text values from the dictionary */
  const { reset_password_text, new_password_desc, change_password_text } = dict;

  /**
   * Change password with API AuthProvider.
   * Submits the new password to the authentication API after validating all required fields.
   * On success, redirects the user to the sign-in form.
   * @param   {FormEvent<HTMLFormElement>} e - Form submission event
   * @returns {Promise<void>}                Promise that resolves when the form submission is complete
   */
  const onResetSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    /** Prevent default form submission behavior */
    e.preventDefault();

    /** Add null checks for form fields to ensure all required data is present */
    if (!email_reg || !otp_code || !password_reg || !password_confirm) {
      setError('Form fields are not properly initialized');
      return;
    }

    try {
      /** Set loading state to indicate form submission in progress */
      setLoading(true);

      /** Call API to change user's password */
      const result = await api.AuthProvider.changePassword(
        'email',
        email_reg.value as string,
        'reg',
        1,
        otp_code.value.toString(),
        password_reg.value as string,
        password_confirm.value as string,
      );

      /** If result is successful, open SignIn form for user to log in with new password */
      if (result) {
        setComponent('SignInForm');
        setAction('');
      }
      /** Reset loading state after form submission */
      setLoading(false);
    } catch (e: any) {
      /** Set error message from exception */
      setError(e.message);
      /** Reset loading state after form submission */
      setLoading(false);
    }
  };

  return (
    /** Form animation wrapper with loading state */
    <FormAnimations isLoading={isLoading}>
      {/** Reset password form with onSubmit handler */}
      <form
        name="resetPasswordForm"
        className="mx-auto flex min-h-full w-full max-w-107.5 flex-col gap-4 text-xl leading-5"
        onSubmit={onResetSubmit}
      >
        {/** Form header with title and description */}
        <div className="relative box-border flex shrink-0 flex-col gap-2.5">
          <h2 className="max-w-full text-xl font-bold text-neutral-600">
            {reset_password_text?.value}
          </h2>
          <p className="max-w-full text-xs text-gray-400">
            {new_password_desc?.value}
          </p>
        </div>

        {/** Form input fields container */}
        <div className="relative mb-8 box-border flex shrink-0 flex-col gap-4">
          {/** Map through reset password form fields to render input components */}
          {resetPasswordFormFields.map((field: any, index: any) => {
            return (
              <FormInput
                localizeInfos={field.localizeInfos}
                marker={''}
                isVisible={false}
                index={index}
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

        {/** Submit button for password reset form */}
        <FormSubmitButton
          title={change_password_text?.value}
          isLoading={isLoading}
          index={10}
        />
        {/** Display error message if present */}
        {isError && <ErrorMessage error={isError} />}
      </form>
    </FormAnimations>
  );
};

export default ResetPasswordForm;
