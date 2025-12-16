/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FormEvent, JSX, Key } from 'react';
import { useContext, useState } from 'react';

import { api, useGetFormByMarkerQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import FormAnimations from '@/components/forms/animations/FormAnimations';

import Loader from '../shared/Loader';
import ErrorMessage from './inputs/ErrorMessage';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';

/**
 * ForgotPassword form component that allows users to initiate the password reset process.
 * This component renders a form where users can enter their email address to receive
 * a verification code for resetting their password. It handles form submission and
 * communicates with the authentication API to generate and send the verification code.
 * @param   {object}           props      - Component properties
 * @param   {string}           props.lang - Current language shortcode (e.g., 'en', 'ru')
 * @param   {IAttributeValues} props.dict - Dictionary with localized values from server API
 * @returns {JSX.Element}                 ForgotPassword form component with email input and submission handling
 */
export const ForgotPasswordForm = ({
  lang,
  dict,
}: {
  lang: string;
  dict: IAttributeValues;
}): JSX.Element => {
  /** Modal context for controlling form modal state */
  const { setComponent, setAction } = useContext(OpenDrawerContext);
  /** State for storing error messages */
  const [isError, setError] = useState<string>('');

  /** Extract localized text values from the dictionary */
  const { reset_descr, send_text } = dict;

  /** Get form data with RTK Query from API for dynamic form fields */
  const { data, isLoading } = useGetFormByMarkerQuery({
    marker: 'reg',
    lang,
  });

  /** Get form fields from Redux state */
  const fields = useAppSelector((state) => state.formFieldsReducer.fields);

  /**
   * Submit form to initiate password reset process.
   * Validates the email field and requests a verification code from the authentication API.
   * On success, opens the verification form for the next step in the password reset flow.
   * @param   {FormEvent<HTMLFormElement>} e - Form submission event
   * @returns {Promise<void>}                Promise that resolves when the form is submitted
   */
  const onSubmitFormHandle = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    /** Prevent default form submission behavior */
    e.preventDefault();

    /** Check if email field exists before proceeding */
    if (!fields.email_reg) {
      setError('Email field is missing');
      return;
    }

    try {
      /** Generate verification code with API and send to user's email */
      await api.AuthProvider.generateCode(
        'email',
        fields.email_reg.value as string,
        'generate_code',
      );
      /** Open Verification form for the next step in password reset process */
      setComponent('VerificationForm');
      setAction('checkCode');
    } catch (e: any) {
      /** Set error message from exception */
      setError(e.message);
      /** Handle bad request errors (e.g., invalid email) */
      if (e.statusCode === 400) {
        /** Delay opening verification form to show error message first */
        setTimeout(() => {
          setComponent('VerificationForm');
        }, 800);
      }
    }
  };

  /** Show loader while form data is being fetched */
  if (!data || isLoading) {
    return <Loader />;
  }

  return (
    /* Form animation wrapper with loading state */
    <FormAnimations isLoading={isLoading}>
      {/** Forgot password form with onSubmit handler */}
      <form
        className="mx-auto flex min-h-120 max-w-87.5 flex-col gap-4 text-xl leading-5"
        onSubmit={(e) => onSubmitFormHandle(e)}
      >
        {/** Form header with title and description */}
        <div className="relative box-border flex shrink-0 flex-col gap-2.5">
          <h2 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
            {data.localizeInfos?.titleForSite}
          </h2>
          <p className="text-xs text-gray-400 max-md:max-w-full">
            {reset_descr?.value}
          </p>
        </div>

        {/** Form input fields container */}
        <div className="relative mb-8 box-border flex shrink-0 flex-col gap-4">
          {/** Map through form attributes to render only the email input field */}
          {data?.attributes.map((field: any, index: Key | number) => {
            /** Only render the email registration field for password reset */
            if (field.marker === 'email_reg') {
              return (
                <FormInput key={index} index={index as number} {...field} />
              );
            }
            return;
          })}
        </div>

        {/** Submit button for forgot password form */}
        <FormSubmitButton
          index={10}
          title={send_text?.value}
          isLoading={isLoading}
        />
        {/** Display error message if present */}
        {isError && <ErrorMessage error={isError} />}
      </form>
    </FormAnimations>
  );
};

export default ForgotPasswordForm;
