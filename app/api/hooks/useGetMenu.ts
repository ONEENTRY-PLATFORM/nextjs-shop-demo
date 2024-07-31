"use client";
import {useContext, useEffect, useState} from 'react';
import {IMenusEntity} from 'oneentry/dist/menus/menusInterfaces';
import {LanguageContext} from '../../providers/LanguageContext';
import {api} from '../api/api';

type UseGetMenuProps = {
  marker: string;
};

export const useGetMenu = ({marker}: UseGetMenuProps) => {
  const [menu, setMenu] = useState<IMenusEntity>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>('');
  const {activeLanguage} = useContext(LanguageContext);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await api.Menus.getMenusByMarker(marker, activeLanguage);
        setMenu(result);
        setLoading(false);
      } catch (e: any) {
        setError(e);
        setLoading(false);
      }
    })();
  }, [activeLanguage]);

  return {
    loading,
    menu,
    error,
  };
};
