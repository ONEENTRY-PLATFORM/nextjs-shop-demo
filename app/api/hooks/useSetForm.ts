'use client';

import type { IFormsPost } from 'oneentry/dist/formsData/formsDataInterfaces';
import { useState } from 'react';

import { api } from '../api/api';

export const useSetForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const sendData = (data: IFormsPost) => {
    setLoading(true);
    const result = async () => {
      try {
        const res = await api.FormData.postFormsData(data);
        return res;
      } catch (e: any) {
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
