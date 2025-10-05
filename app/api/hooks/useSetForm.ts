'use client';

import type { IBodyPostFormData } from 'oneentry/dist/forms-data/formsDataInterfaces';
import { useState } from 'react';

import { api } from '@/app/api';

/**
 * Custom hook for handling form submissions to the OneEntry CMS
 *
 * This hook provides functionality to submit form data with loading state management.
 * It's designed to work with OneEntry CMS form endpoints.
 * @example
 * const { loading, sendData } = useSetForm();
 *
 * const handleSubmit = async (formData) => {
 *   const result = await sendData(formData);
 *   if (result?.error) {
 *     console.error('Form submission failed:', result.error);
 *   } else {
 *     console.log('Form submitted successfully');
 *   }
 * };
 * @see {@link https://doc.oneentry.cloud/docs/forms OneEntry CMS forms documentation}
 * @returns {object} An object containing:
 *                   - loading: boolean indicating submission status
 *                   - sendData: function to submit form data, returns Promise<unknown>
 */
export const useSetForm = (): {
  loading: boolean;
  sendData: (data: IBodyPostFormData) => Promise<unknown>;
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
