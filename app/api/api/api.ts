import { defineOneEntry } from 'oneentry';

const PROJECT_URL = process.env.NEXT_PUBLIC_PROJECT_URL as string;
const APP_TOKEN = process.env.NEXT_PUBLIC_APP_TOKEN as string;

/**
 * This function used to update user JWT token and save to localStorage
 * @param   {string}        refreshToken - Refresh token from API
 * @returns {Promise<void>}              Promise that resolves when token is saved
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry CMS docs}
 */
const saveFunction = async (refreshToken: string): Promise<void> => {
  if (!refreshToken) {
    return;
  }
  localStorage.setItem('refresh-token', refreshToken);
};

/**
 * Initial api definition
 * @param PROJECT_URL - Project url from .env
 * @param APP_TOKEN   - Token from .env
 * @returns           api instance
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry CMS docs}
 */
export let api = defineOneEntry(PROJECT_URL, {
  token: APP_TOKEN,
  langCode: 'en_US',
  auth: {
    saveFunction,
  },
  errors: {
    isShell: false,
  },
});

/**
 * This function used to update api config
 * @param   {string}        refreshToken - Refresh token from localStorage
 * @param   {string}        langCode     - Current language code
 * @returns {Promise<void>}              Promise that resolves when api is redefined
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry CMS docs}
 */
export async function reDefine(
  refreshToken: string,
  langCode: string,
): Promise<void> {
  if (!refreshToken) {
    return;
  }

  api = defineOneEntry(PROJECT_URL, {
    langCode: langCode || 'en_US',
    token: APP_TOKEN,
    auth: {
      refreshToken,
      saveFunction,
    },
    errors: {
      isShell: false,
    },
  });
}
