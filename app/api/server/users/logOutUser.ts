import { api } from '@/app/api';
import { handleApiError } from '@/app/utils/errorHandler';

type LogOutProps = { marker: string; token?: string };

/**
 * User logOut with API AuthProvider
 *
 * @async
 * @param marker - The text identifier of the authorization provider. Example - email
 * @see {@link https://doc.oneentry.cloud/docs/users OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 * @description This method requires user authorization. For more information about configuring the authorization module, see the documentation in the configuration settings section of the SDK.
 *
 * @returns {Promise<{ data?: any; error?: string }>} - Promise object that represents the result of the logOutUser function. If the logOutUser function is successful, the promise will resolve with an object containing the data returned from the API. If there is an error, the promise will resolve with an object containing the error message.
 */
export const logOutUser = async ({
  marker,
}: LogOutProps): Promise<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  error?: string;
}> => {
  try {
    const token = localStorage.getItem('refresh-token');
    if (!token) {
      throw Error('No token provided');
    }
    const result = await api.AuthProvider.logout(marker, token);
    return { data: result };
  } catch (error) {
    const apiError = handleApiError(error);
    return { error: apiError.message };
  }
};
