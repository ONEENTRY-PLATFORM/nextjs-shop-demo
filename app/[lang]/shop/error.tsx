'use client';

import type { JSX } from 'react';

/**
 * Error boundary component for handling errors in the shop section.
 *
 * This component is automatically rendered by Next.js when an error occurs
 * during rendering of the shop page or its child components.
 * @param   {object}                      props       - The error component props
 * @param   {Error & { digest?: string }} props.error - The error object containing information about the error that occurred
 * @param   {void}                        props.reset - A function to retry rendering the segment by resetting the error boundary
 * @returns {JSX.Element}                             The error display component with retry option
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3 p-8 text-center">
      <h2 className="text-lg font-semibold">
        There was an error loading the catalog.
      </h2>
      <p className="text-gray-600 break-all">
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
