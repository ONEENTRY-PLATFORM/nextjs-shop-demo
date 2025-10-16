import 'server-only';

import { cache } from 'react';

const serverContext = cache(() => new Map());

/**
 * Simple server provider
 * @param   {string}  key          - key
 * @param   {unknown} defaultValue - defaultValue
 * @returns {unknown}              Provider getter/setter
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ServerProvider = <T,>(key: string, defaultValue?: T): any => {
  /** Get global server context */
  const global = serverContext();

  /** Set default value if provided */
  if (defaultValue !== undefined) {
    global.set(key, defaultValue);
  }

  /* Return current value and setter function */
  return [global.get(key), (value: T) => global.set(key, value)];
};
