import { api } from '@/app/api';

type LogOutProps = { marker: string; token?: string };

/**
 * User logOut with API AuthProvider
 *
 * @description — This method requires user authorization. For more information about configuring the authorization module, see the documentation in the configuration settings section of the SDK.
 * @param marker
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry docs}
 *
 * @returns result
 */
export const logOutUser = async ({ marker }: LogOutProps) => {
  try {
    const token = localStorage.getItem('refresh-token');
    if (!token) {
      throw Error('No token provided');
    }
    const result = await api.AuthProvider.logout(marker, token);
    return { data: result };
  } catch (e: unknown) {
    return { error: (e as Error).message };
  }
};
