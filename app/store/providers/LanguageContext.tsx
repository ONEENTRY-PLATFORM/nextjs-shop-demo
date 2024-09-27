'use client';

import type { ILocalEntity } from 'oneentry/dist/locales/localesInterfaces';
import type { Dispatch, ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';

import { useGetLocales } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

type ContextProps = {
  activeLanguage: LanguageEnum;
  languagesData: unknown;
  setActiveLanguage: Dispatch<LanguageEnum>;
};
export const LanguageContext = createContext<ContextProps>({
  activeLanguage: LanguageEnum.en,
  setActiveLanguage(): void {},
  languagesData: null,
});

type ProviderProps = {
  children: ReactNode;
};
export const LanguageProvider = ({ children }: ProviderProps) => {
  const [languagesData, setLanguagesData] = useState<
    { label: string; value: string }[]
  >([]);
  const [activeLanguage, setActiveLanguage] = useState<LanguageEnum>(
    LanguageEnum.en,
  );
  const { locales } = useGetLocales();

  useEffect(() => {
    (async () => {
      if (locales?.length) {
        const localesEdit = locales.map((lang: ILocalEntity) => {
          return {
            label: lang.shortCode.toUpperCase(),
            value: lang.code,
          };
        });
        setLanguagesData(localesEdit);
      }
    })();
  }, [locales]);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    activeLanguage,
    languagesData,
    setActiveLanguage,
  };
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
