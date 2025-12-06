/* eslint-disable jsdoc/reject-any-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import type { Dispatch, JSX, ReactNode } from 'react';
import { createContext, useState } from 'react';

/**
 * Open drawer context
 * @property {string}            component     - Component name
 * @property {boolean}           open          - Open state
 * @property {string}            action        - Action type
 * @property {string}            data          - Additional data
 * @property {string}            transition    - Transition type
 * @property {Dispatch<string>}  setComponent  - Component setter
 * @property {Dispatch<boolean>} setOpen       - Open state setter
 * @property {Dispatch<string>}  setData       - Action setter
 * @property {Dispatch<any>}     setAction     - Action setter
 * @property {Dispatch<string>}  setTransition - Transition setter
 */
export const OpenDrawerContext = createContext<{
  component: string;
  open: boolean;
  action: string;
  data: any;
  transition: string;
  setComponent: Dispatch<string>;
  setOpen: Dispatch<boolean>;
  setAction: Dispatch<string>;
  setData: Dispatch<any>;
  setTransition: Dispatch<string>;
}>({
  open: false,
  component: '',
  action: '',
  data: {},
  transition: '',
  setOpen(_value: boolean): void {},
  setComponent(_value: string): void {},
  setAction(_value: string): void {},
  setData(_value: string): void {},
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
  /** Action type for the drawer */
  const [action, setAction] = useState<string>('');
  /** Transition type for the drawer */
  const [transition, setTransition] = useState<string>('');
  /** Data for the drawer */
  const [data, setData] = useState<string>('');

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
        data,
        setData,
        transition,
        setTransition,
      }}
    >
      {children}
    </OpenDrawerContext.Provider>
  );
};
