'use client';

import type { ReactNode } from 'react';
import { createContext, useEffect } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { addContent } from '@/app/store/reducers/SystemContentSlice';

const ContentContext = createContext({});

type Props = {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalData: any;
};

export const ContentContextProvider = ({ children, globalData }: Props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (globalData) {
      dispatch(addContent(globalData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalData]);

  return <ContentContext.Provider value>{children}</ContentContext.Provider>;
};
