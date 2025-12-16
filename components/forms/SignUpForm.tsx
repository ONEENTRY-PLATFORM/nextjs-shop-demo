/* eslint-disable jsdoc/no-undefined-types */
'use client';

import type { ISignUpData } from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import type { IAttributes } from 'oneentry/dist/base/utils';
import type { FormEvent, JSX, Key } from 'react';
import { useContext, useState } from 'react';

import { useGetFormByMarkerQuery } from '@/app/api';
import { logInUser } from '@/app/api';
import { api } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import { LanguageEnum } from '@/app/types/enum';
import type { FormProps } from '@/app/types/global';
import FormAnimations from '@/components/forms/animations/FormAnimations';

import { typeError } from '../utils/utils';
import ErrorMessage from './inputs/ErrorMessage';
import FormInput from './inputs/FormInput';
import SubmitButton from './inputs/FormSubmitButton';

/**
 * SignUp form component that handles user registration.
 * This component renders a registration form with fields for user information,
 * processes form validation, and submits the data to create a new user account.
 * It also handles post-registration flows such as automatic login for active users
 * or OTP verification for new accounts.
 * @param   {FormProps}        props      - Component properties
 * @param   {string}           props.lang - Current language shortcode (e.g., 'en', 'ru')
 * @param   {IAttributeValues} props.dict - Dictionary with localized values from server API
 * @returns {JSX.Element}                 SignUp form component with validation and submission handling
 */
const SignUpForm = ({ lang, dict }: FormProps): JSX.Element => {
  /** State for managing loading status during form submission */
  const [loading, setIsLoading] = useState<boolean>(false);
  /** State for storing error messages */
  const [error, setError] = useState<string>('');

  /** Authentication context for user authentication */
  const { authenticate } = useContext(AuthContext);
  /** Modal context for controlling form modal state */
  const { setOpen, setComponent, setAction } = useContext(OpenDrawerContext);

  /** Extract localized text values from the dictionary */
  const { sign_up_text, sign_in_text, create_account_desc } = dict;

  /** Get form by marker with RTK Query for dynamic form fields */
  const { data, isLoading } = useGetFormByMarkerQuery({
    marker: 'reg',
    lang,
  });

  /** Get form fields from Redux state */
  const fields = useAppSelector((state) => state.formFieldsReducer.fields);

  /**
   * SignUp form submit handler.
   * Validates form fields, prepares registration data, and submits to the API.
   * Handles different post-registration flows based on user activation status.
   * @param   {FormEvent<HTMLFormElement>} e - Form event object
   * @returns {Promise<void>}                Promise that resolves when the form is submitted
   */
  const onSignUp = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    /** Prevent default form submission behavior */
    e.preventDefault();

    /** Required form fields array for registration validation */
    const formFields = [
      'email_reg',
      'password_reg',
      'name_reg',
      'phone_reg',
      'address_reg',
      'email_notifications',
    ];

    /** Validate all form fields before submission */
    const canSubmit = Object.keys(fields).reduce((isValid, field) => {
      /** If any field is invalid, return false */
      if (!isValid) {
        return false;
      }
      /** Check if the current field is valid */
      const fieldData = fields[field as keyof typeof fields];
      return fieldData ? fieldData.valid : false;
    }, true);

    /** Process form submission only if all fields are valid */
    if (canSubmit) {
      /** Prepare form data for API submission by mapping fields */
      const formData = Object.keys(fields).reduce(
        (
          arr: Array<{
            marker: string;
            type: string;
            value: string;
          }>,
          field,
        ) => {
          /** Get field value from Redux state */
          const fieldValue = fields[field as keyof typeof fields];
          /** Create data structure for each field */
          const candidate = {
            marker: field,
            type: 'string',
            value: fieldValue ? String(fieldValue.value) : '',
          };
          /** Include only required fields in form data */
          if (formFields.includes(field)) {
            arr.push(candidate);
          }
          return arr;
        },
        [],
      );

      /** Add email notifications data to form */
      formData.push({
        marker: 'email_notifications',
        type: 'string',
        value: fields.email_reg?.value ? String(fields.email_reg.value) : '',
      });

      /** Prepare sign up data structure for API call */
      const data: ISignUpData = {
        formIdentifier: 'reg',
        authData: [
          {
            marker: 'email_reg',
            value: (fields.email_reg?.value as string) || '',
          },
          {
            marker: 'password_reg',
            value: (fields.password_reg?.value as string) || '',
          },
        ],
        formData,
        notificationData: {
          email: (fields.email_reg?.value as string) || '',
          phonePush: [(fields.phone_reg?.value as string) || ''],
          phoneSMS: (fields.phone_reg?.value as string) || '',
        },
      };

      /** Set loading state to indicate form submission in progress */
      setIsLoading(true);

      /** Attempt to sign up user via API AuthProvider */
      try {
        /** Get language code for API request */
        const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
        /** Submit registration data to the API */
        const res = await api.AuthProvider.signUp('email', data, langCode);

        /** Handle successful registration based on user activation status */
        if (res && res.isActive) {
          /** Automatically log in and authenticate active user */
          await logInUser({
            login: res.identifier,
            password: (fields.password_reg?.value as string) || '',
          });
          authenticate();
        }
        // Handle inactive user requiring verification
        else if (res && !res.isActive && !typeError(res)) {
          /** Open verification form for new user activation */
          setOpen(true);
          setComponent('VerificationForm');
          setAction('activateUser');
        }

        /** Clear previous errors */
        setError('');
        /** Handle API error responses */
        if (typeError(res)) {
          setError('Error ' + res.status);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        /** Set error message from exception */
        setError(e.message);
      }
      /** Reset loading state after form submission */
      setIsLoading(false);
    }
  };

  return (
    /* Form animation wrapper with loading state */
    <FormAnimations isLoading={isLoading}>
      {/** Registration form with onSubmit handler */}
      <form
        onSubmit={(e) => onSignUp(e)}
        className="mx-auto flex min-h-full w-full max-w-107.5 flex-col gap-4 text-xl leading-5"
      >
        {/** Form header with title and sign-in link */}
        <div className="relative box-border flex shrink-0 flex-col gap-2.5">
          <h2 className="slide-up text-xl font-bold text-neutral-600 max-md:max-w-full">
            {sign_up_text?.value}
          </h2>

          <p className="slide-up text-xs text-gray-400 max-md:max-w-full">
            {/** Sign-in link to switch to login form */}
            <button
              onClick={() => {
                setComponent('SignInForm');
              }}
              className="underline"
            >
              {sign_in_text?.value}
            </button>{' '}
            {create_account_desc?.value}
          </p>
        </div>

        {/** Form input fields container */}
        <div className="relative mb-4 box-border flex shrink-0 flex-col gap-4">
          {/** Map through form attributes to render input fields */}
          {data?.attributes.map((field: IAttributes, index: Key | number) => {
            /** Exclude email notifications field from regular input rendering */
            if (field.marker !== 'email_notifications') {
              return (
                <FormInput
                  index={index as number}
                  key={index}
                  {...field}
                  value={field.value}
                />
              );
            }
            return;
          })}
        </div>

        {/** Submit button for registration form */}
        <SubmitButton
          title={sign_up_text?.value}
          isLoading={loading || isLoading}
          index={10}
        />
        {/** Display error message if present */}
        {error && <ErrorMessage error={error} />}
      </form>
    </FormAnimations>
  );
};

export default SignUpForm;
