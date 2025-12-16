/* eslint-disable jsdoc/no-undefined-types */
'use client';

import type { IAuthFormData } from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import type { IAttributes } from 'oneentry/dist/base/utils';
import type { FormDataType } from 'oneentry/dist/forms-data/formsDataInterfaces';
import type { FormEvent, JSX, Key } from 'react';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { api, useGetFormByMarkerQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import type { FormProps } from '@/app/types/global';
import FormAnimations from '@/components/forms/animations/FormAnimations';

import AuthError from '../pages/AuthError';
import Loader from '../shared/Loader';
import ErrorMessage from './inputs/ErrorMessage';
import FormInput from './inputs/FormInput';
import SubmitButton from './inputs/FormSubmitButton';

/**
 * Input value type.
 * @property {string}  value - Input value.
 * @property {boolean} valid - Input validation status.
 * @property {unknown} [key] - Input key.
 */
export type InputValue = {
  value: string;
  valid: boolean;
  [key: string]: unknown;
};

/**
 * User form component for managing user profile information.
 * Allows authenticated users to update their personal data.
 * @param   {FormProps}        props      - Component props.
 * @param   {string}           props.lang - Current language shortcode.
 * @param   {IAttributeValues} props.dict - dictionary from server api.
 * @returns {JSX.Element}                 User form component.
 */
const UserForm = ({ lang, dict }: FormProps): JSX.Element => {
  /** Authentication context providing user authentication status and methods */
  const { isAuth, refreshUser, user } = useContext(AuthContext);

  /** Loading state for form submission */
  const [loading, setLoading] = useState(false);

  /** Error state for form submission errors */
  const [isError, setError] = useState('');

  /**
   * Fetch user registration form data by marker using RTK Query
   * This retrieves form configuration and fields from the OneEntry CMS
   */
  const { data, isLoading, error } = useGetFormByMarkerQuery({
    marker: 'reg',
    lang,
  });

  /**
   * Get form field values from Redux store
   * These values are updated as the user interacts with form inputs
   */
  const fields = useAppSelector((state) => state.formFieldsReducer.fields);

  /**
   * Handle user data update submission
   * Prepares form data and sends it to the OneEntry API to update user information
   * @param {FormEvent<HTMLFormElement>} e - Form submission event
   */
  const onUpdateUserData = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);

      /** Prepare form data for submission. Maps through form attributes and creates data objects for each field */
      const formData: IAuthFormData[] = data?.attributes
        .map((field: IAttributes) => {
          if (field.marker !== 'email_notifications') {
            const fieldData = fields[field.marker as keyof typeof fields];
            if (fieldData) {
              return {
                marker: field.marker,
                value: fieldData.value,
                type: 'string',
              };
            }
          }
          return null;
        })
        .filter(function (el: null) {
          return el !== null;
        });

      /** Update user with Users API. Sends the prepared form data to update the user's profile information */
      if (user?.formIdentifier) {
        await api.Users.updateUser({
          formIdentifier: user.formIdentifier,
          formData,
          authData: [
            {
              marker: 'password_reg',
              value: String(fields['password_reg']?.value || ''),
            },
          ],
          notificationData: {
            email: String(fields['email_reg']?.value || ''),
            phonePush: [],
            phoneSMS: String(fields['phone_reg']?.value || ''),
          },
          state: {},
        });
      }
      refreshUser();
      setError('');
      setLoading(false);
      toast('Data saved!');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      refreshUser();
      setLoading(false);
      setError(e.message);
    }
  };

  /** Show loader while form data is being fetched */
  if (isLoading) {
    return <Loader />;
  }

  /** Show authentication error if user is not authenticated or data is unavailable */
  if (!isAuth || error || !user?.formData) {
    return <AuthError dict={dict} />;
  }

  return (
    <FormAnimations isLoading={isLoading}>
      <form
        className="flex min-h-full w-full max-w-107.5 flex-col gap-4 text-xl leading-5"
        onSubmit={(e) => onUpdateUserData(e)}
      >
        <div className="relative mb-4 box-border flex shrink-0 flex-col gap-4">
          {/** Map through form attributes and render FormInput components Each input is populated with user's current data */}
          {data?.attributes.map((field: IAttributes, index: Key | number) => {
            const fieldData = Array.isArray(user.formData)
              ? (user.formData.find(
                  (item) => item.marker === field.marker,
                ) as FormDataType)
              : {};

            if (field.marker !== 'email_notifications') {
              return (
                <FormInput
                  key={index}
                  index={index as number}
                  {...field}
                  {...fieldData}
                  value={fieldData.value}
                />
              );
            }
            return;
          })}
        </div>

        <SubmitButton
          title={dict?.save_button_text?.value}
          isLoading={loading}
          index={10}
        />
        {isError && <ErrorMessage error={isError} />}
      </form>
    </FormAnimations>
  );
};

export default UserForm;
