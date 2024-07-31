import {useCallback, useRef, useState} from 'react';
import {
  //ISessionBody,
  ISessionEntity,
} from 'oneentry/dist/payments/paymentsInterfaces';
import {api} from '../api/api';

type PaymentSessionProps = {};

export const useSetPaymentSession = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const session = useRef<ISessionEntity>();
  const [refetch, setRefetch] = useState<boolean>(false);
  const setSession = useCallback(
    async (orderId: number) => {
      setLoading(true);
      try {
        const result = await api.Payments.createSession(orderId, 'session');
        console.log(result);
        session.current = result;
      } catch (e: any) {
        console.log(e);
        setError((e as Error).message);
      }
      setLoading(false);
    },
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
