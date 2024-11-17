import { defineOneEntry } from 'oneentry';

const PROJECT_URL = process.env.NEXT_PUBLIC_PROJECT_URL as string;
const APP_TOKEN = process.env.NEXT_PUBLIC_APP_TOKEN as string;

/**
 * This function used to update user JWT token and save to localStorage
 *
 * @param {string} refreshToken Refresh token from API
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry docs}
 *
 * @returns void
 */
const saveFunction = async (refreshToken: string) => {
  localStorage.setItem('refresh-token', refreshToken);
};

/**
 * Initial api definition
 *
 * @param {string} PROJECT_URL Project url from .env
 * @param {string} APP_TOKEN Token from .env
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry docs}
 *
 * @returns api
 */
export let api = defineOneEntry(PROJECT_URL, {
  token: APP_TOKEN,
  auth: {
    saveFunction,
  },
});

/**
 * This function used to update api config
 *
 * @param {string} refreshToken Refresh token from localStorage
 * @param {string} langCode Current language code
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry docs}
 *
 * @returns void
 */
export async function reDefine(refreshToken: string, langCode: string) {
  api = defineOneEntry(PROJECT_URL, {
    langCode: langCode || 'en_US',
    token: APP_TOKEN,
    auth: {
      saveFunction,
      refreshToken,
    },
  });
}
