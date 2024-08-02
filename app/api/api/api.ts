'use client';

import { defineOneEntry } from 'oneentry';

const PROJECT_URL = 'https://react-native-course.oneentry.cloud';
const APP_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmVhY3RfYXBwIiwic2VyaWFsTnVtYmVyIjoxLCJpYXQiOjE3MDA0ODAwMDYsImV4cCI6MTc0Nzk5OTk2MX0.gz3KTCITg6FhM_SwtuOZl3GsMr4MlVEPg9sw3d8Q0Po';

// This function used to update user JWT token
const saveFunction = async (res: string) => {
  localStorage.setItem('refreshToken', res);
};

// Initial api definition
// eslint-disable-next-line import/no-mutable-exports
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
