import { api } from '@/app/api';

type LogOutProps = { marker: string; token?: string };

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
