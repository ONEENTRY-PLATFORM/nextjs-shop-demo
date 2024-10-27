/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import type { IAuthFormData } from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import type { IAttributes, IAttributeValues } from 'oneentry/dist/base/utils';
import type { FormDataType } from 'oneentry/dist/formsData/formsDataInterfaces';
import type { FC, FormEvent, Key } from 'react';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { api, useGetFormByMarkerQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import FormAnimations from '@/components/forms/animations/FormAnimations';

import AuthError from '../shared/AuthError';
import Loader from '../shared/Loader';
import ErrorMessage from './inputs/ErrorMessage';
import FormInput from './inputs/FormInput';
import SubmitButton from './inputs/FormSubmitButton';

export type InputValue = {
  value: string;
  valid: boolean;
  [key: string]: unknown;
};

const UserForm: FC<{ lang: string; dict: IAttributeValues }> = ({
  lang,
  dict,
}) => {
  const { isAuth, refreshUser, user } = useContext(AuthContext);
  const { data, isLoading, error } = useGetFormByMarkerQuery({
    marker: 'reg',
    lang,
  });

  const [loading, setLoading] = useState(false);
  const [isError, setError] = useState('');

  const fields = useAppSelector(
    (state) => state.formFieldsReducer.fields,
  ) as object as {
    email_reg: {
      valid: boolean;
      value: string;
    };
    name_reg: {
      valid: boolean;
      value: string;
    };
    phone_reg: {
      valid: boolean;
      value: string;
    };
    password_reg: {
      valid: boolean;
      value: string;
    };
  };

  const onUpdateUserData = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData: IAuthFormData[] = data?.attributes
        .map((field: IAttributes, index: Key) => {
          if (field.marker !== 'email_notifications') {
            return {
              marker: field.marker,
              value: fields[field.marker as keyof typeof fields].value,
              type: 'string',
            };
          }
          return null;
        })
        .filter(function (el: null) {
          return el !== null;
        });
      if (user?.formIdentifier) {
        await api.Users.updateUser({
          formIdentifier: user.formIdentifier,
          formData,
          authData: [
            {
              marker: 'password_reg',
              value: fields['password_reg'].value,
            },
          ],
          notificationData: {
            email: fields['email_reg'].value,
            phonePush: [],
            phoneSMS: fields['phone_reg'].value,
          },
          // !!! USER STATE
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

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuth || error || !user?.formData) {
    return <AuthError dict={dict} />;
  }

  return (
    <FormAnimations isLoading={isLoading}>
      <form
        className="flex min-h-full w-full max-w-[430px] flex-col gap-4 text-xl leading-5"
        onSubmit={(e) => onUpdateUserData(e)}
      >
        <div className="relative mb-4 box-border flex shrink-0 flex-col gap-4">
          {data?.attributes.map((field: IAttributes, index: Key | number) => {
            const fieldData =
              Array.isArray(user.formData) &&
              (user.formData.find(
                (item) => item.marker === field.marker,
              ) as FormDataType[]);
            if (field.marker !== 'email_notifications') {
              return (
                <FormInput
                  key={index}
                  index={index as number}
                  {...field}
                  {...fieldData}
                />
              );
            }
          })}
        </div>

        <SubmitButton
          title={dict?.save_button_text.value}
          isLoading={loading}
          index={10}
        />
        {isError && <ErrorMessage error={isError} />}
      </form>
    </FormAnimations>
  );
};

export default UserForm;
