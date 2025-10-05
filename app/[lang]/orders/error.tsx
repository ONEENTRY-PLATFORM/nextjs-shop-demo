'use client';

/**
 * Error boundary component for handling errors in the orders section.
 *
 * This component is automatically rendered by Next.js when an error occurs
 * during rendering of the orders page or its child components.
 *
 * @param props - The error component props
 * @param props.error - The error object containing information about the error that occurred
 * @param props.reset - A function to retry rendering the segment by resetting the error boundary
 *
 * @returns The error display component with retry option
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 p-8 text-center">
      <h2 className="text-lg font-semibold">Error loading orders</h2>
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
