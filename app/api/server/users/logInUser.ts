import type { IAuthPostBody } from 'oneentry/dist/auth-provider/authProvidersInterfaces';

import { api } from '@/app/api';
import { handleApiError } from '@/app/utils/errorHandler';

type LogInProps = { login: string; password: string };

/**
 * User authorization with API AuthProvider
 * @async
 * @param login
 * @param password
 * @see {@link https://doc.oneentry.cloud/docs/users OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 *
 * @returns result
 */
export const logInUser = async ({ login, password }: LogInProps) => {
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
    const result = await api.AuthProvider.auth('email', preparedData);
    if (result && result.accessToken && result.refreshToken) {
      return { data: result };
    }
    // Handle case where result exists but doesn't have required tokens
    return { error: 'Authentication failed' };
  } catch (error) {
    const apiError = handleApiError(error);
    return { error: apiError.message };
  }
};
