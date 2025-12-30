'use client';

import { useApiErrorHandler } from '@/app/utils/errorHandler';
import type { JSX } from 'react';

/**
 * Error boundary component for handling errors in the orders section.
 *
 * This component is automatically rendered by Next.js when an error occurs
 * during rendering of the orders page or its child components.
 * @param   {object}                      props       - The error component props
 * @param   {string}                      props.title - The title of the error message
 * @param   {Error & { digest?: string }} props.error - The error object containing information about the error that occurred
 * @returns {JSX.Element}                             The error display component with retry option
 */
export default function ErrorMessage({
  title,
  error,
}: {
  title: string;
  error: Error & { digest?: string };
}): JSX.Element {
  const reset = () => {
    //
  };
  return (
    <div className="flex flex-col items-center gap-3 p-8 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="break-all text-gray-600">
        {error?.message ?? 'Unknown error'}
      </p>
      <button
        type="button"
        className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
