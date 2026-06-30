'use client';

import { createContext, useContext } from 'react';

/**
 * Navigation state shared with the page subtree during a transition.
 * @property {boolean} keepSidebar - When true, the sidebar menu must stay
 *                                 visible even though the page content is
 *                                 hidden behind the transition skeleton
 *                                 (i.e. navigating between sidebar routes).
 */
export interface NavigationState {
  keepSidebar: boolean;
}

/** Context exposing the current page-transition state. */
export const NavigationContext = createContext<NavigationState>({
  keepSidebar: false,
});

/**
 * Access the current page-transition state.
 * @returns {NavigationState} The navigation state.
 */
export const useNavigation = (): NavigationState =>
  useContext(NavigationContext);
