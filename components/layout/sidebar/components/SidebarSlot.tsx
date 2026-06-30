'use client';

import type { JSX, ReactNode } from 'react';

import { useNavigation } from '@/app/animations/NavigationContext';

/**
 * SidebarSlot — the sidebar `<aside>` container that keeps the menu visible
 * during a page transition.
 *
 * While navigating, the page content is hidden (`visibility: hidden`) instead
 * of being covered by a background, so the old content is removed cleanly. When
 * moving between sidebar routes, this slot forces `visibility: visible` so the
 * already-loaded menu stays on screen (it isn't re-shown as a skeleton).
 * @param   {object}      props          - Component props.
 * @param   {ReactNode}   props.children - The sidebar menu (with its own Suspense).
 * @returns {JSX.Element}                The sidebar aside.
 */
const SidebarSlot = ({ children }: { children: ReactNode }): JSX.Element => {
  const { keepSidebar } = useNavigation();

  return (
    <aside
      className="w-52.5 pb-8 max-md:w-full"
      style={keepSidebar ? { visibility: 'visible' } : undefined}
    >
      {children}
    </aside>
  );
};

export default SidebarSlot;
