'use client';

import { useSyncExternalStore } from 'react';

/**
 * No-op subscribe — the hydration flag never changes after the first commit.
 * @returns {() => void} An unsubscribe function that does nothing.
 */
const subscribe = (): (() => void) => () => {};

/**
 * Returns `false` during SSR and the first (hydrating) client render, then
 * `true` on every render afterwards.
 *
 * Use it to gate values that only exist on the client (e.g. redux-persist
 * state read from localStorage): render the server-safe fallback until the
 * component is hydrated, then switch to the real value. This avoids React
 * hydration mismatches without calling `setState` inside an effect (forbidden
 * by `react-hooks/set-state-in-effect`).
 *
 * Built on `useSyncExternalStore`: React uses `getServerSnapshot` for the
 * initial client render so it matches the server HTML, then re-renders with
 * `getSnapshot`.
 * @returns {boolean} Whether the component has hydrated on the client.
 */
export const useHydrated = (): boolean =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
