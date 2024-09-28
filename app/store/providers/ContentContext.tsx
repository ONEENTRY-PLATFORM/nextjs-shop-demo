'use client';

import type { ReactNode } from 'react';
import { createContext, useEffect } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { addContent } from '@/app/store/reducers/SystemContentSlice';

const ContentContext = createContext({});

type Props = {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  systemContent: any;
};

export const ContentContextProvider = ({ children, systemContent }: Props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (systemContent) {
      dispatch(addContent(systemContent));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemContent]);

  return <ContentContext.Provider value>{children}</ContentContext.Provider>;
};
