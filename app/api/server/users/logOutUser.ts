import { getApi } from '@/app/api';
import { isIError } from '@/app/utils/errorHandler';

type LogOutProps = { marker: string; token?: string };

/**
 * User logOut with API AuthProvider
 * @description This method requires user authorization. For more information about configuring the authorization module, see the documentation in the configuration settings section of the SDK.
 * @async
 * @param   {LogOutProps}     props        - The token of the authorization provider.
 * @param   {string}          props.marker - The text identifier of the authorization provider. Example - email
 * @returns {Promise<object>}              Promise object that represents the result of the logOutUser function. If the logOutUser function is successful, the promise will resolve with an object containing the data returned from the API. If there is an error, the promise will resolve with an object containing the error message.
 * @see {@link https://doc.oneentry.cloud/docs/users OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const logOutUser = async ({
  marker,
}: LogOutProps): Promise<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  error?: string;
}> => {
  const token = localStorage.getItem('refresh-token');

  if (!token) {
    return { error: 'No token provided' };
  }

  const result = await getApi().AuthProvider.logout(marker, token);

  if (isIError(result)) {
    return { error: result.message };
  }

  return { data: result };
};
