/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import type { Dispatch, ReactNode } from 'react';
import React, { createContext, useState } from 'react';

type OpenDrawerContextType = {
  component: string;
  setComponent: Dispatch<string>;
  open: boolean;
  setOpen: Dispatch<boolean>;
};

export const OpenDrawerContext = createContext<OpenDrawerContextType>({
  open: false,
  setOpen(value: boolean): void {},
  component: '',
  setComponent(value: string): void {},
});

export const OpenDrawerProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [component, setComponent] = useState<string>('');

  return (
    <OpenDrawerContext.Provider
      value={{ open, setOpen, component, setComponent }}
    >
      {children}
    </OpenDrawerContext.Provider>
  );
};
