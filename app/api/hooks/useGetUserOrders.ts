'use client';

import type { IOrdersByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';
import { useEffect, useState } from 'react';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

export const useGetUserOrders = ({
  marker,
  limit,
  offset,
  lang,
}: {
  marker: string;
  limit?: number;
  offset?: number;
  lang?: string;
}): {
  loading: boolean;
  orders?: IOrdersByMarkerEntity;
  total?: number;
  refetch: () => void;
} => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const [loading, setLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<IOrdersByMarkerEntity>();
  const [total, setTotal] = useState<number>(0);
  const [refetch, setRefetch] = useState<boolean>(false);

  useEffect(() => {
    if (!marker) {
      return;
    }
    setLoading(true);
    (async () => {
      try {
        const result = await api.Orders.getAllOrdersByMarker(
          marker,
          langCode,
          limit || 10,
          offset || 0,
        );
        if (result) {
          setOrders(result);
          setTotal(result.total);
        }
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    })();
  }, [refetch, langCode, marker, limit, offset]);

  return {
    loading,
    orders,
    total,
    refetch() {
      setRefetch(!refetch);
    },
  };
};
