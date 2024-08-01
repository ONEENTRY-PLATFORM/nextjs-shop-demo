import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {api, reDefine} from '../api/index';
import {useLazyGetMeQuery} from '../api';
import {IUserEntity} from 'oneentry/dist/users/usersInterfaces';
import {LanguageContext} from './LanguageContext';

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

export const AuthProvider = ({children}: Props) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<IUserEntity | undefined>();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [refetchUser, setRefetchUser] = useState<boolean>(false);
  const [trigger, {isError}] = useLazyGetMeQuery({pollingInterval: 5000});
  const {activeLanguage} = useContext(LanguageContext);

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
      .then(async res => {
        if (res.error && !res.isLoading) {
          localStorage.setItem('refreshToken', '');
          return setIsAuth(false);
        }
        setUser(res.data);
        setIsAuth(true);
      })
      .catch(async e => {
        localStorage.setItem('refreshToken', '');
        setIsAuth(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    onInit().then(() => {});
    setIsLoading(false);
  }, [refetch, activeLanguage]);

  useEffect(() => {
    if (isError) {
      setIsAuth(false);
    }
  }, [isError]);



  useEffect(() => {
    if (isAuth) {
      trigger({})
        .then(res => {
          if (res.error && !res.isLoading) {
            localStorage.setItem('refreshToken', '')
            return setIsAuth(false);
          }
          setUser(res.data);
        })
        .catch(e => {
          localStorage.setItem('refreshToken', '')
          setIsAuth(false);
        });
    }
  }, [refetchUser]);

  useEffect(() => {
  }, []);

  const value = {
    isAuth,
    isLoading,
    user,
    authenticate: () => setRefetch(!refetch),
    refreshUser: () => setRefetchUser(!refetchUser),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
