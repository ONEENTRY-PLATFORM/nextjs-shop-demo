import type { ReactNode } from 'react';

/**
 * A layout component that renders its children directly.
 * This is a simple pass-through component that doesn't add any additional wrapping elements.
 * @param children.children
 * @param children          - The child components to be rendered within this layout
 * @returns                 The children components passed to the layout
 */
const Layout = ({ children }: { children: ReactNode }) => children;

export default Layout;
