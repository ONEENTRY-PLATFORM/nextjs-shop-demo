'use client';

// import type { ISignUpData } from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import type { IAuthFormData } from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import React, { useContext } from 'react';

import { api, useGetForm } from '@/app/api';
// import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';

// import { useAppSelector } from '@/app/store/hooks';
import { userFormFields } from '../data';
// import Loader from '../shared/Loader';
import FormInput from './inputs/FormInput';

export type InputValue = {
  value: string;
  valid: boolean;
  [key: string]: unknown;
};

const UserForm: React.FC = () => {
  // const form = useGetForm({
  //   marker: 'sign_in',
  // });
  // console.log(form);

  // const { user_name_placeholder, user_phone_placeholder } = useAppSelector(
  //   (state) => state.systemContentReducer.content,
  // );

  const { authenticate } = useContext(AuthContext);
  const { isAuth, isLoading } = useContext(AuthContext);
  console.log(isAuth);

  const { refreshUser, user } = useContext(AuthContext);

  const onUpdateUserData = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      const formData: IAuthFormData[] = [];

      if (user?.formIdentifier) {
        await api.Users.updateUser({
          formIdentifier: user.formIdentifier,
          formData,
          authData: [],
          notificationData: {
            email: '',
            phonePush: [],
            phoneSMS: '',
          },
        });
      }

      refreshUser();
      // setEditing(!editing);
    } catch (e: unknown) {
      // Alert.alert(e.message);
      console.error(e);
      refreshUser();
    }
  };

  return (
    <form
      className="flex min-h-full flex-col gap-4 text-xl leading-5"
      onSubmit={(e) => onUpdateUserData(e)}
    >
      <div className="relative mb-4 box-border flex shrink-0 flex-col gap-4">
        {userFormFields.map((field, index) => {
          return <FormInput key={index} {...field} />;
        })}
      </div>

      <button
        type="submit"
        className="mt-auto flex w-[282px] max-w-full items-center justify-center self-center rounded-[30px] border border-none border-[black] bg-orange-500 px-5 py-4 text-base font-medium uppercase text-white max-md:mt-10 max-md:px-5"
      >
        Save
      </button>
    </form>
  );
};

export default UserForm;
