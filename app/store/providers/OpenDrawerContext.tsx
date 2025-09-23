/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import type { Dispatch, ReactNode } from 'react';
import React, { createContext, useState } from 'react';

type OpenDrawerContextType = {
  component: string;
  open: boolean;
  action: string;
  transition: string;
  setComponent: Dispatch<string>;
  setOpen: Dispatch<boolean>;
  setAction: Dispatch<string>;
  setTransition: Dispatch<string>;
};

export const OpenDrawerContext = createContext<OpenDrawerContextType>({
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
 * @param children children ReactNode
 * @returns Drawer context provider
 */
export const OpenDrawerProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [component, setComponent] = useState<string>('');
  const [action, setAction] = useState<string>('');
  const [transition, setTransition] = useState<string>('');

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
