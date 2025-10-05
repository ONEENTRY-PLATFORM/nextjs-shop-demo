import type { ReactNode } from 'react';

/**
 * A layout component that renders its children directly.
 * This is a simple pass-through component that doesn't add any additional wrapping elements.
 * @param   {object}    props          - Component properties
 * @param   {ReactNode} props.children - The child components to be rendered within this layout
 * @returns {ReactNode}                The children components passed to the layout
 */
const Layout = ({ children }: { children: ReactNode }): ReactNode => children;

export default Layout;
