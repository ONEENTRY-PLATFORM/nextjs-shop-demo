import {createContext, Dispatch, ReactNode, useEffect, useState} from 'react';
import {LanguageEnum} from '../types/enum';
import {useGetLocales} from '../api';
import {ILocalEntity} from 'oneentry/dist/locales/localesInterfaces';

type ContextProps = {
  activeLanguage: LanguageEnum;
  languagesData: any;
  setActiveLanguage: Dispatch<LanguageEnum>;
};
export const LanguageContext = createContext<ContextProps>({
  activeLanguage: LanguageEnum.EN,
  setActiveLanguage(): void {},
  languagesData: null,
});

type ProviderProps = {
  children: ReactNode;
};
export const LanguageProvider = ({children}: ProviderProps) => {
  const [languagesData, setLanguagesData] = useState<DropdownItem[]>([]);
  const [activeLanguage, setActiveLanguage] = useState<LanguageEnum>(
    LanguageEnum.EN,
  );
  const {locales} = useGetLocales();

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
