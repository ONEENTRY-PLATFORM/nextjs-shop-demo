import 'server-only';

import { cache } from 'react';

const serverContext = cache(() => new Map());

/**
 * Simple server provider
 * @componentType Server component
 * @param         key          - key
 * @param         defaultValue - defaultValue
 * @returns                    Provider getter/setter
 */
export const ServerProvider = <T,>(key: string, defaultValue?: T) => {
  const global = serverContext();

  if (defaultValue !== undefined) {
    global.set(key, defaultValue);
  }

  return [global.get(key), (value: T) => global.set(key, value)];
};
