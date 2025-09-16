'use client';

import type { IBodyPostFormData } from 'oneentry/dist/forms-data/formsDataInterfaces';
import { useState } from 'react';

import { api } from '@/app/api';

/**
 * Post forms data with FormData API
 * @see {@link https://doc.oneentry.cloud/docs/forms OneEntry CMS docs}
 * @returns object
 */
export const useSetForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const sendData = (data: IBodyPostFormData) => {
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
