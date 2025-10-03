'use client';

import type { IBodyPostFormData } from 'oneentry/dist/forms-data/formsDataInterfaces';
import { useState } from 'react';

import { api } from '@/app/api';

/**
 * Custom hook for submitting form data to OneEntry CMS
 *
 * @example
 * const { loading, sendData } = useSetForm();
 *
 * const handleSubmit = async () => {
 *   const result = await sendData(formData);
 *   if (result.success) {
 *     console.log('Form submitted successfully');
 *   }
 * };
 *
 * @see {@link https://doc.oneentry.cloud/docs/forms OneEntry CMS forms documentation}
 *
 * @returns An object containing:
 * - loading: boolean indicating submission status
 * - sendData: function to submit form data, returns Promise<any>
 */
export const useSetForm = (): {
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendData: (data: IBodyPostFormData) => Promise<any>;
} => {
  const [loading, setLoading] = useState<boolean>(false);

  const sendData = (data: IBodyPostFormData) => {
    setLoading(true);
    const result = async () => {
      try {
        const res = await api.FormData.postFormsData(data);
        return res;
      } catch (e: unknown) {
        // eslint-disable-next-line no-console
        console.error('Form submission error:', e);
        return e;
      } finally {
        setLoading(false);
      }
    };
    return result();
  };

  return {
    loading,
    sendData,
  };
};
