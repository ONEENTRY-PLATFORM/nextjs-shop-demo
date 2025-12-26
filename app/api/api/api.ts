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
 * Internal api instance that can be mutated
 */
let apiInstance = defineOneEntry(PROJECT_URL, {
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
 * API getter that returns current api instance
 * This ensures we always get the latest reDefineed instance
 * @returns Current api instance
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry CMS docs}
 */
export const getApi = () => apiInstance;

/**
 * Exported api for backward compatibility
 * Note: This creates a proxy that always returns the current instance
 */
export const api = new Proxy({} as ReturnType<typeof defineOneEntry>, {
  get: (_target, prop) => {
    // Always get the fresh value from current apiInstance
    const value = (apiInstance as any)[prop];

    // If it's an object (Users, Products, etc.), wrap it in a proxy
    if (value && typeof value === 'object' && prop !== 'constructor') {
      return new Proxy(value, {
        get: (_subTarget, subProp) => {
          // Always get the fresh value from current apiInstance
          const currentValue = (apiInstance as any)[prop];
          const method = currentValue[subProp];

          // If it's a function, bind it to the current context
          if (typeof method === 'function') {
            return method.bind(currentValue);
          }

          return method;
        },
      });
    }

    return value;
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

  apiInstance = defineOneEntry(PROJECT_URL, {
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
