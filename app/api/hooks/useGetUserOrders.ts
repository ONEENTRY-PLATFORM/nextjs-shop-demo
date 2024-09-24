'use client';

import type { IOrdersByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';
import { useContext, useEffect, useState } from 'react';

import { api } from '@/app/api';
import { LanguageContext } from '@/app/store/providers/LanguageContext';

export const useGetUserOrders = ({
  marker,
  limit,
  offset,
}: {
  marker: string;
  limit?: number;
  offset?: number;
}): {
  loading: boolean;
  orders?: IOrdersByMarkerEntity;
  total?: number;
  refetch: () => void;
} => {
  const [loading, setLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<IOrdersByMarkerEntity>();
  const [total, setTotal] = useState<number>(0);
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
          activeLanguage,
          limit || 10,
          offset || 0,
        );
        setOrders(result);
        setTotal(result.total);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    })();
  }, [refetch, activeLanguage, marker, limit, offset]);

  return {
    loading,
    orders,
    total,
    refetch() {
      setRefetch(!refetch);
    },
  };
};
