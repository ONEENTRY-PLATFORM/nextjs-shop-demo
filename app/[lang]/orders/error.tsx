'use client';

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
