import 'server-only';

import { cache } from 'react';

const serverContext = cache(() => new Map());

/**
 * Simple server provider
 * @param   {string}  key          - key
 * @param   {unknown} defaultValue - defaultValue
 * @returns {unknown}              Provider getter/setter
 */
export const ServerProvider = <T,>(key: string, defaultValue?: T): object => {
  const global = serverContext();

  if (defaultValue !== undefined) {
    global.set(key, defaultValue);
  }

  return [global.get(key), (value: T) => global.set(key, value)];
};
