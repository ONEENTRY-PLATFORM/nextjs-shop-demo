'use client';

import type { JSX, ReactNode } from 'react';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';

import type { AppStore } from '../store';
import { setupStore } from '../store';

/**
 * Store provider
 * @param   {object}      props          - props
 * @param   {ReactNode}   props.children - children ReactNode
 * @returns {JSX.Element}                Redux provider
 */
export default function StoreProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  /** */
  const storeRef = useRef<AppStore>(undefined);
  /** */
  if (!storeRef.current) {
    /** */
    storeRef.current = setupStore();
    /** */
    persistStore(storeRef.current);
  }

  /** */
  return <Provider store={storeRef.current}>{children}</Provider>;
}
