import type { IAuthPostBody } from 'oneentry/dist/auth-provider/authProvidersInterfaces';

import { api } from '@/app/api';

type LogInProps = { method: string; login: string; password: string };

/**
 * User authorization with API AuthProvider
 * @async
 * @param method The text identifier of the authorization provider. Example - email
 * @param login
 * @param password
 * @see {@link https://doc.oneentry.cloud/docs/users OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 *
 * @returns result
 */
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
    if (result && result.accessToken && result.refreshToken) {
      return { data: result };
    }
  } catch (e: unknown) {
    return { error: (e as Error).message };
  }
};
