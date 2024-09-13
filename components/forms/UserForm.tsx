/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import type { IAuthFormData } from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import type { IAttributes } from 'oneentry/dist/base/utils';
import type { FormDataType } from 'oneentry/dist/formsData/formsDataInterfaces';
import type { FC, FormEvent, Key } from 'react';
import React, { useContext, useState } from 'react';

import { api, useGetFormByMarkerQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';

import Loader from '../shared/Loader';
import Spinner from '../shared/Spinner';
import FormInput from './inputs/FormInput';

export type InputValue = {
  value: string;
  valid: boolean;
  [key: string]: unknown;
};

const UserForm: FC = () => {
  const [loading, setLoading] = useState(false);
  const { data, isLoading, error } = useGetFormByMarkerQuery({ marker: 'reg' });

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
  const { isAuth } = useContext(AuthContext);

  const { refreshUser, user } = useContext(AuthContext);

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
        });
      }
      refreshUser();
      setLoading(false);
    } catch (e: unknown) {
      console.error(e);
      refreshUser();
      setLoading(false);
    }
  };

  if (isLoading || error) {
    return <Loader />;
  }

  if (!isAuth) {
    return 'Auth error';
  }

  return (
    <form
      className="mx-auto flex min-h-full w-full max-w-[430px] flex-col gap-4 text-xl leading-5"
      onSubmit={(e) => onUpdateUserData(e)}
    >
      <div className="relative mb-4 box-border flex shrink-0 flex-col gap-4">
        {data?.attributes.map((field: IAttributes, index: Key) => {
          const fieldData = user?.formData.find(
            (item) => item.marker === field.marker,
          ) as FormDataType[];
          if (field.marker !== 'email_notifications') {
            return <FormInput key={index} {...field} {...fieldData} />;
          }
        })}
      </div>

      <button
        type="submit"
        className="mt-auto flex w-[280px] max-w-full items-center justify-center self-center rounded-[30px] border border-none border-[black] bg-orange-500 px-5 py-4 text-base font-medium uppercase text-white max-md:mt-10 max-md:px-5"
      >
        {isLoading ? <Spinner /> : 'Save'}
      </button>
    </form>
  );
};

export default UserForm;
