const PROJECT_URL = 'https://react-native-course.oneentry.cloud';
const APP_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmVhY3RfYXBwIiwic2VyaWFsTnVtYmVyIjoxLCJpYXQiOjE3MDA0ODAwMDYsImV4cCI6MTc0Nzk5OTk2MX0.gz3KTCITg6FhM_SwtuOZl3GsMr4MlVEPg9sw3d8Q0Po';

import { defineOneEntry } from 'oneentry';

// This function used to update user JWT token
const saveFunction = async (refreshToken: string) => {
  localStorage.setItem('refresh-token', refreshToken);
};

// Initial api definition
export let api = defineOneEntry(PROJECT_URL, {
  token: APP_TOKEN,
  auth: {
    saveFunction,
  },
});

// This function used to update api config
export async function reDefine(refreshToken: string, langCode?: string) {
  api = defineOneEntry(PROJECT_URL, {
    langCode: langCode || 'en_US',
    token: APP_TOKEN,
    auth: {
      saveFunction,
      refreshToken,
    },
  });
}
