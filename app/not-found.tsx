import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-80 w-full max-w-screen-xl flex-col items-center justify-center py-8">
      <h2 className="mb-10 text-6xl">404</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
