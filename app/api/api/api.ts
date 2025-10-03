import { defineOneEntry } from 'oneentry';

const PROJECT_URL = process.env.NEXT_PUBLIC_PROJECT_URL as string;
const APP_TOKEN = process.env.NEXT_PUBLIC_APP_TOKEN as string;

/**
 * This function used to update user JWT token and save to localStorage
 *
 * @param refreshToken - Refresh token from API
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry CMS docs}
 * @returns Promise that resolves when token is saved
 */
const saveFunction = async (refreshToken: string) => {
  if (!refreshToken) {
    return;
  }
  localStorage.setItem('refresh-token', refreshToken);
};

/**
 * Initial api definition
 *
 * @param PROJECT_URL - Project url from .env
 * @param APP_TOKEN - Token from .env
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry CMS docs}
 * @returns api instance
 */
export let api = defineOneEntry(PROJECT_URL, {
  token: APP_TOKEN,
  auth: {
    saveFunction,
  },
  errors: {
    isShell: false,
  },
});

/**
 * This function used to update api config
 *
 * @param refreshToken - Refresh token from localStorage
 * @param langCode - Current language code
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry CMS docs}
 * @returns Promise that resolves when api is redefined
 */
export async function reDefine(refreshToken: string, langCode: string) {
  api = defineOneEntry(PROJECT_URL, {
    langCode: langCode || 'en_US',
    token: APP_TOKEN,
    auth: {
      saveFunction,
      refreshToken,
    },
    errors: {
      isShell: false,
    },
  });
}
