'use client';

import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';
import type { ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { reDefine, useLazyGetMeQuery } from '../../api';
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
  const [trigger, { isError }] =
    useLazyGetMeQuery(/**{ pollingInterval: 5000 } */);
  const { activeLanguage } = useContext(LanguageContext);

  const onInit = async () => {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) {
      setIsAuth(false);
      return;
    }

    reDefine(refresh, activeLanguage);

    await checkToken();
  };

  const checkToken = async () => {
    trigger({})
      .then(async (res) => {
        if (res.error && !res.isLoading) {
          localStorage.setItem('refreshToken', '');
          return setIsAuth(false);
        }
        setUser(res.data);
        setIsAuth(true);
      })
      .catch(async () => {
        localStorage.setItem('refreshToken', '');
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
    if (isError) {
      setIsAuth(false);
    }
  }, [isError]);

  useEffect(() => {
    console.log(isAuth);
    if (isAuth) {
      trigger({})
        .then(
          (res: {
            error: any;
            isLoading: boolean;
            data: SetStateAction<IUserEntity | undefined>;
          }) => {
            if (res.error && !res.isLoading) {
              localStorage.setItem('refreshToken', '');
              return setIsAuth(false);
            }
            setUser(res.data);
          },
        )
        .catch(() => {
          localStorage.setItem('refreshToken', '');
          setIsAuth(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchUser]);

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
