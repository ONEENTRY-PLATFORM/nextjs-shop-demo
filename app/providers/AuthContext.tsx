import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api, reDefine} from '../api/index';
import {useLazyGetMeQuery} from '../api';
import {IUserEntity} from 'oneentry/dist/users/usersInterfaces';
import {LanguageContext} from './LanguageContext';
import {logJSON} from '../utils/logJSON';
import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";

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
    const refresh = await AsyncStorage.getItem('refresh-token');

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
          await AsyncStorage.setItem('refresh-token', '');
          return setIsAuth(false);
        }
        logJSON(res);
        setUser(res.data);
        // await AsyncStorage.setItem('refresh-token', res);
        setIsAuth(true);
      })
      .catch(async e => {
        await AsyncStorage.setItem('refresh-token', '');
        setIsAuth(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    onInit().then(() => {});
    setIsLoading(false);
    logJSON(isAuth);
  }, [refetch, activeLanguage]);

  useEffect(() => {
    if (isError) {
      setIsAuth(false);
    }
  }, [isError]);



  useEffect(() => {
    if (isAuth) {
      trigger({})
        .then(async res => {
          if (res.error && !res.isLoading) {
            await AsyncStorage.setItem('refresh-token', '');
            return setIsAuth(false);
          }
          setUser(res.data);
        })
        .catch(async e => {
          await AsyncStorage.setItem('refresh-token', '');
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
