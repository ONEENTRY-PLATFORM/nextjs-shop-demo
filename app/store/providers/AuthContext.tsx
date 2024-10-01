'use client';

import type { IAuthFormData } from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import type { IAttributes } from 'oneentry/dist/base/utils';
import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';
import type { Key, ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';

import { api, reDefine, useLazyGetMeQuery } from '@/app/api';

import { useAppSelector } from '../hooks';

type ContextProps = {
  isAuth: boolean;
  isLoading: boolean;
  userToken?: string;
  user?: IUserEntity;
  authenticate: () => void;
  refreshUser: () => void;
};

export const AuthContext = createContext<ContextProps>({
  isAuth: false,
  isLoading: false,
  authenticate: () => {},
  refreshUser: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
  langCode: string;
};

export const AuthProvider = ({ children, langCode }: AuthProviderProps) => {
  const fields = useAppSelector(
    (state) => state.formFieldsReducer.fields,
  ) as object as {
    phone_reg: {
      value: string;
      valid: boolean;
    };
    email_reg: {
      value: string;
      valid: boolean;
    };
    password_reg: {
      value: string;
      valid: boolean;
    };
  };
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<IUserEntity | undefined>();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [refetchUser, setRefetchUser] = useState<boolean>(false);

  const [trigger, { isError }] = useLazyGetMeQuery({
    pollingInterval: isAuth ? 10000 : 0,
  });

  const onInit = async () => {
    const refresh = localStorage.getItem('refresh-token');
    if (!refresh) {
      setIsAuth(false);
      return;
    }
    await reDefine(refresh, langCode);
    await checkToken();
  };

  const updateUser = async () => {
    if (user) {
      try {
        const formData = Object.keys(fields).reduce(
          (
            arr: Array<{
              marker: string;
              type: string;
              value: string;
            }>,
            field,
          ) => {
            const candidate = {
              marker: field,
              type: 'string',
              value: fields[field as keyof typeof fields].value,
            };
            if (field !== 'otp_code') {
              arr.push(candidate);
            }
            return arr;
          },
          [],
        );
        formData.push({
          marker: 'email_notifications',
          type: 'string',
          value: fields.email_reg.value,
        });
        const isUpdate = await api.Users.updateUser(
          {
            formIdentifier: 'reg',
            formData,
            authData: [
              {
                marker: 'email_reg',
                value: fields.email_reg.value,
              },
              {
                marker: 'password_reg',
                value: fields['password_reg'].value,
              },
            ],
            notificationData: {
              email: fields.email_reg.value,
              phonePush: [fields.phone_reg.value],
              phoneSMS: fields.phone_reg.value,
            },
            state: {
              test: 'tset',
            },
          },
          langCode,
        );
        console.log(isUpdate);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    // updateUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth, user]);

  const checkToken = async () => {
    trigger({
      langCode,
    })
      .then(async (res) => {
        if (res.error && !res.isLoading) {
          localStorage.setItem('refresh-token', '');
          return setIsAuth(false);
        } else {
          setUser(res.data);
          setIsAuth(true);
        }
      })
      .catch(async () => {
        localStorage.setItem('refresh-token', '');
        setIsAuth(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    onInit().then(() => {
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, langCode]);

  useEffect(() => {
    const refresh = localStorage.getItem('refresh-token');
    if (isError && refresh) {
      setRefetch(true);
    }
  }, [isError]);

  useEffect(() => {
    if (isAuth) {
      checkToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, refetchUser]);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    isAuth,
    isLoading,
    user,
    authenticate: () => setRefetch(!refetch),
    refreshUser: () => setRefetchUser(!refetchUser),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
