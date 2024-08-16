'use client';

import type { Dispatch, ReactNode } from 'react';
import React, { createContext, useState } from 'react';

type OpenDrawerContextType = {
  component: string;
  open: boolean;
  setOpen: Dispatch<boolean>;
};

export const OpenDrawerContext = createContext<OpenDrawerContextType>({
  component: '',
  open: false,
  setOpen(value: boolean): void {},
});

export const OpenDrawerProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <OpenDrawerContext.Provider
      value={{ open, setOpen, component: 'SignInEmail' }}
    >
      {children}
    </OpenDrawerContext.Provider>
  );
};
