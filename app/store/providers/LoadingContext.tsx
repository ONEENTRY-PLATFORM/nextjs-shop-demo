'use client';
import type { Dispatch } from 'react';
import React, { createContext, useState } from 'react';
// import {LanguageEnum} from '../types/enum';
// import Loader from '../ui/space/Loader';

type LoadingContextType = {
  loading: boolean;
  setLoading: Dispatch<boolean>;
};
export const LoadingContext = createContext<LoadingContextType>({
  loading: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setLoading(value: boolean): void {},
});

type Props = {
  children: React.ReactNode;
};

export const LoadingProvider = ({ children }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    loading,
    setLoading,
  };
  if (loading) {
    // return <Loader />;
  }
  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};
