'use client';

import type { IFormsPost } from 'oneentry/dist/formsData/formsDataInterfaces';
import { useState } from 'react';

import { api } from '@/app/api';

/**
 * Post forms data with FormData API
 * @returns object
 */
export const useSetForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const sendData = (data: IFormsPost) => {
    setLoading(true);
    const result = async () => {
      try {
        const res = await api.FormData.postFormsData(data);
        return res;
      } catch (e: unknown) {
        return e;
      }
    };
    setLoading(false);
    return result;
  };
  return {
    loading,
    sendData,
  };
};
