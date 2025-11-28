/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import type { Dispatch, JSX, ReactNode } from 'react';
import { createContext, useState } from 'react';

/**
 * Open drawer context
 * @property {string}            component     - Component name
 * @property {boolean}           open          - Open state
 * @property {string}            action        - Action type
 * @property {string}            transition    - Transition type
 * @property {Dispatch<string>}  setComponent  - Component setter
 * @property {Dispatch<boolean>} setOpen       - Open state setter
 * @property {Dispatch<string>}  setAction     - Action setter
 * @property {Dispatch<string>}  setTransition - Transition setter
 */
export const OpenDrawerContext = createContext<{
  component: string;
  open: boolean;
  action: string;
  transition: string;
  setComponent: Dispatch<string>;
  setOpen: Dispatch<boolean>;
  setAction: Dispatch<string>;
  setTransition: Dispatch<string>;
}>({
  open: false,
  component: '',
  action: '',
  transition: '',
  setOpen(_value: boolean): void {},
  setComponent(_value: string): void {},
  setAction(_value: string): void {},
  setTransition(_value: string): void {},
});

/**
 * Context provider for modals
 * @param   {object}      props          - Provider props
 * @param   {ReactNode}   props.children - Children ReactNode
 * @returns {JSX.Element}                Drawer context provider
 */
export const OpenDrawerProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  /** Track open state of the drawer */
  const [open, setOpen] = useState<boolean>(false);
  /** Track component to be rendered in the drawer */
  const [component, setComponent] = useState<string>('');
  /** Track action type for the drawer */
  const [action, setAction] = useState<string>('');
  /** Track transition type for the drawer */
  const [transition, setTransition] = useState<string>('');

  /** Provide context values to children components */
  return (
    <OpenDrawerContext.Provider
      value={{
        component,
        setComponent,
        open,
        setOpen,
        action,
        setAction,
        transition,
        setTransition,
      }}
    >
      {children}
    </OpenDrawerContext.Provider>
  );
};
