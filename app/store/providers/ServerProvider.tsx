import 'server-only';

import { cache } from 'react';

const serverContext = cache(() => new Map());

/**
 * Simple server provider
 * @param key key
 * @param defaultValue defaultValue
 *
 * @componentType Server component
 * @returns Provider getter/setter
 */
export const useServerProvider = <T,>(key: string, defaultValue?: T) => {
  const global = serverContext();

  if (defaultValue !== undefined) {
    global.set(key, defaultValue);
  }

  return [global.get(key), (value: T) => global.set(key, value)];
};
