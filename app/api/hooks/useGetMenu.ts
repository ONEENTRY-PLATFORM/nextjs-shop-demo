'use client';

import type { IMenusEntity } from 'oneentry/dist/menus/menusInterfaces';
import { useContext, useEffect, useState } from 'react';

import { api } from '@/app/api';
import { LanguageContext } from '@/app/store/providers/LanguageContext';

type UseGetMenuProps = {
  marker: string;
};

export const useGetMenu = ({ marker }: UseGetMenuProps) => {
  const [menu, setMenu] = useState<IMenusEntity>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>('');
  const { activeLanguage } = useContext(LanguageContext);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await api.Menus.getMenusByMarker(marker, activeLanguage);
        setMenu(result);
        setLoading(false);
      } catch (e: unknown) {
        setError(e);
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLanguage]);

  return {
    loading,
    menu,
    error,
  };
};
