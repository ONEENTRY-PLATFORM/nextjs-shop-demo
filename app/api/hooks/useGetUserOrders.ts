'use client';

import type { IOrdersByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';
import { useContext, useEffect, useState } from 'react';

import { api } from '@/app/api';
import { LanguageContext } from '@/app/store/providers/LanguageContext';

export const useGetUserOrders = ({
  marker,
  langCode,
  limit,
  offset,
}: {
  marker: string;
  langCode?: string;
  limit?: number;
  offset?: number;
}): {
  loading: boolean;
  orders: IOrdersByMarkerEntity | undefined;
  refetch: () => void;
} => {
  const [loading, setLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<IOrdersByMarkerEntity>();
  const [refetch, setRefetch] = useState<boolean>(false);
  const { activeLanguage } = useContext(LanguageContext);

  useEffect(() => {
    if (!marker) {
      return;
    }
    setLoading(true);
    (async () => {
      try {
        const result = await api.Orders.getAllOrdersByMarker(
          marker,
          langCode || activeLanguage,
          limit || 10,
          offset || 0,
        );
        setOrders(result);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    })();
  }, [refetch, activeLanguage, marker, langCode, limit, offset]);

  return {
    loading,
    orders,
    refetch() {
      setRefetch(!refetch);
    },
  };
};
