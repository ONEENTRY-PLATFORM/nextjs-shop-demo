/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { reDefine, useLazyGetMeQuery } from '@/app/api';

import { LanguageContext } from './LanguageContext';

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

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<IUserEntity | undefined>();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [refetchUser, setRefetchUser] = useState<boolean>(false);
  const [trigger, { isError }] = useLazyGetMeQuery({
    pollingInterval: isAuth ? 5000 : 0,
  });
  const { activeLanguage } = useContext(LanguageContext);

  const onInit = async () => {
    const refresh = localStorage.getItem('refresh-token');
    if (!refresh) {
      setIsAuth(false);
      return;
    }
    await reDefine(refresh, activeLanguage);
    await checkToken();
  };

  const checkToken = async () => {
    trigger({})
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
  }, [refetch, activeLanguage]);

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
