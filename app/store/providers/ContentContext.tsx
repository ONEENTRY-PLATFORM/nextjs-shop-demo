'use client';

import type { ReactNode } from 'react';
import { createContext, useEffect } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { addContent } from '@/app/store/reducers/SystemContentSlice';

const ContentContext = createContext({});

type Props = {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
};

export const ContentContextProvider = ({ children, dict }: Props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (dict) {
      dispatch(addContent(dict));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dict]);

  return <ContentContext.Provider value>{children}</ContentContext.Provider>;
};
