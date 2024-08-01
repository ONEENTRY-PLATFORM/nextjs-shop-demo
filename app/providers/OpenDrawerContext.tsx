import type { Dispatch } from 'react';
import React, { createContext, useState } from 'react';

type OpenDrawerContextType = {
  open: boolean;
  setOpen: Dispatch<boolean>;
  setActive: Dispatch<string>;
  active: string;
};
export const OpenDrawerContext = createContext<OpenDrawerContextType>({
  open: false,
  setOpen(value: boolean): void {},
  active: '',
  setActive(value: string): void {},
});

export const OpenDrawerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [active, setActive] = useState<string>('home');
  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <OpenDrawerContext.Provider value={{ open, setOpen, active, setActive }}>
      {children}
    </OpenDrawerContext.Provider>
  );
};
