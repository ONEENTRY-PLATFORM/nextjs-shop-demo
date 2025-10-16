import type { IAuthPostBody } from 'oneentry/dist/auth-provider/authProvidersInterfaces';

import { api } from '@/app/api';
import { handleApiError } from '@/app/utils/errorHandler';

type LogInProps = { login: string; password: string };

/**
 * User authorization with API AuthProvider
 * @param   {LogInProps}      props          - User authorization data.
 * @param   {string}          props.login    - User login.
 * @param   {string}          props.password - User password.
 * @returns {Promise<object>}                User authorization result.
 * @see {@link https://doc.oneentry.cloud/docs/users OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const logInUser = async ({
  login,
  password,
}: LogInProps): Promise<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  error?: string;
}> => {
  /** Attempt to authenticate user with provided credentials */
  try {
    /** Prepare authentication data with email and password */
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
    /** Call the authentication API with prepared data */
    const result = await api.AuthProvider.auth('email', preparedData);
    /** Check if authentication was successful by verifying tokens */
    if (result && result.accessToken && result.refreshToken) {
      return { data: result };
    }
    /** Handle case where result exists but doesn't have required tokens */
    return { error: 'Authentication failed' };
  } catch (error) {
    /** Handle API errors during authentication */
    const apiError = handleApiError('auth', error);
    /** Return error message */
    return { error: apiError.message };
  }
};
