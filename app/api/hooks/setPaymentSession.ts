/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import type {
  ICreateSessionEntity,
  // ISessionBody,
  ISessionEntity,
} from 'oneentry/dist/payments/paymentsInterfaces';
import { useCallback, useRef, useState } from 'react';

import { api } from '../api/api';

export const useSetPaymentSession = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const session = useRef<ICreateSessionEntity>();
  const [refetch, setRefetch] = useState<boolean>(false);
  const setSession = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (orderId: number) => {
      setLoading(true);
      try {
        const result = await api.Payments.createSession(orderId, 'session');
        session.current = result;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        // console.log(e);
        setError((e as Error).message);
      }
      setLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refetch],
  );

  return {
    loading,
    refetch: () => setRefetch(!refetch),
    error,
    setSession,
    session: session.current,
  };
};
