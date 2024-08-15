'use client';

import type { Dispatch } from 'react';
import React, { createContext, useState } from 'react';

type OpenDrawerContextType = {
  open: boolean;
  setOpen: Dispatch<boolean>;
};

export const OpenDrawerContext = createContext<OpenDrawerContextType>({
  open: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOpen(value: boolean): void {},
});

export const OpenDrawerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <OpenDrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </OpenDrawerContext.Provider>
  );
};
