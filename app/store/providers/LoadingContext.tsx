'use client';

import type { Dispatch } from 'react';
import React, { createContext, useState } from 'react';

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

  if (loading) {
    return '...Loading';
  }
  return (
    <LoadingContext.Provider
      value={{
        loading,
        setLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
