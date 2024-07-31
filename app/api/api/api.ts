import {defineOneEntry} from 'oneentry';
import {PROJECT_URL, APP_TOKEN} from '@env';

// This function used to update user JWT token
const saveFunction = async (res: string) => {
  localStorage.setItem('refreshToken', res)
};

// Initial api definition
export let api = defineOneEntry(PROJECT_URL, {
  langCode: 'en_US',
  token: APP_TOKEN,
  auth: {
    saveFunction,
  },
});

// This function used to update api config
export function reDefine(refreshToken: string, langCode?: string) {
  api = defineOneEntry(PROJECT_URL, {
    langCode: langCode || 'en_US',
    token: APP_TOKEN,
    auth: {
      saveFunction,
      refreshToken,
    },
  });
}
