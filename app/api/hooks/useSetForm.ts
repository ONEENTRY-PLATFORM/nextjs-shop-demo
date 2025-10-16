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
  /** Loading state for form submission */
  const [loading, setLoading] = useState<boolean>(false);

  /* Function to send form data to the API */
  const sendData = (data: IBodyPostFormData) => {
    /** Set loading state to true when starting submission */
    setLoading(true);
    /* Create async function to handle the API call */
    const result = async () => {
      /** Try to submit form data to the API */
      try {
        const res = await api.FormData.postFormsData(data);
        return res;
      } catch (e: unknown) {
        // eslint-disable-next-line no-console
        console.error('Form submission error:', e);
        return e;
      } finally {
        /** Reset loading state when submission is complete */
        setLoading(false);
      }
    };
    return result();
  };

  /** Return loading state and send function */
  return {
    loading,
    sendData,
  };
};
