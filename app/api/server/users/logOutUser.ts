import { getApi, isError } from '@/app/api/api/api';

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
  data?: boolean;
  error?: string;
}> => {
  const token = localStorage.getItem('refresh-token');

  if (!token) {
    return { error: 'No token provided' };
  }

  const result = await getApi().AuthProvider.logout(marker, token);

  // Always drop the local session, even if the server logout failed. On success
  // the SDK already clears it via saveFunction(''); on failure it does not, and
  // a leftover token would be re-used on the next re-init and burned on a doomed
  // proactive /refresh (400 → 401). The user clicked logout — log them out locally.
  localStorage.removeItem('refresh-token');

  if (isError(result)) {
    return { error: result.message };
  }

  return { data: result };
};
