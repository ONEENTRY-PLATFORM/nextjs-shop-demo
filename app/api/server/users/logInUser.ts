import type { IAuthEntity, IAuthPostBody } from 'oneentry/types';

import { getApi, isError } from '@/app/api/api/api';
import { getApiErrorMessage } from '@/app/utils/getApiErrorMessage';

/**
 * Credentials plus the CMS markers the caller resolved for them.
 * @property {string} login            - User login.
 * @property {string} password         - User password.
 * @property {string} [loginMarker]    - Marker of the login field from the CMS form (`isLogin`).
 * @property {string} [passwordMarker] - Marker of the password field from the CMS form (`isPassword`).
 */
type LogInProps = {
  login: string;
  password: string;
  loginMarker?: string;
  passwordMarker?: string;
};

/**
 * User authorization with API AuthProvider
 *
 * The field markers come from the caller, which resolves them by the SDK flags
 * `isLogin` / `isPassword` of the CMS form (auth-provider rule); the literals
 * are only a fallback for a form whose flags are not configured.
 * @param   {LogInProps}      props                  - User authorization data.
 * @param   {string}          props.login            - User login.
 * @param   {string}          props.password         - User password.
 * @param   {string}          [props.loginMarker]    - Marker of the login field.
 * @param   {string}          [props.passwordMarker] - Marker of the password field.
 * @returns {Promise<object>}                        User authorization result.
 * @see {@link https://doc.oneentry.cloud/docs/users OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const logInUser = async ({
  login,
  password,
  loginMarker,
  passwordMarker,
}: LogInProps): Promise<{
  data?: IAuthEntity;
  error?: string;
}> => {
  const preparedData: IAuthPostBody = {
    authData: [
      { marker: loginMarker || 'email_reg', value: login },
      { marker: passwordMarker || 'password_reg', value: password },
    ],
  };

  const result = await getApi().AuthProvider.auth('email', preparedData);

  if (isError(result)) {
    return { error: getApiErrorMessage(result) };
  }

  if (result && result.accessToken && result.refreshToken) {
    return { data: result };
  }

  return { error: 'Login or password is incorrect. Please try again.' };
};
