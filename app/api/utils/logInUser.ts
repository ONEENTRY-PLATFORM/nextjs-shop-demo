/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { IAuthPostBody } from 'oneentry/dist/auth-provider/authProvidersInterfaces';

import { api } from '@/app/api';

type LogInProps = { method: string; login: string; password: string };

export const logInUser = async ({ method, login, password }: LogInProps) => {
  try {
    const preparedData: IAuthPostBody = {
      authData: [
        {
          marker: 'email_reg',
          value: login,
        },
        {
          marker: 'password_reg',
          value: password,
        },
      ],
    };
    const result = await api.AuthProvider.auth(method, preparedData);
    // @ts-ignore
    if (!result?.error && result?.accessToken) {
      return { data: result };
    }
    // @ts-ignore
    throw new Error(result?.error);
  } catch (e: unknown) {
    return { error: (e as Error).message };
  }
};

type LogOutProps = { marker: string; token?: string };

export const logOutUser = async ({ marker }: LogOutProps) => {
  try {
    // @ts-ignore
    const token = localStorage.getItem('refresh-token', res);
    if (!token) {
      throw Error('No token provided');
    }
    const result = await api.AuthProvider.logout(marker, token);
    return { data: result };
  } catch (e: unknown) {
    return { error: (e as Error).message };
  }
};
