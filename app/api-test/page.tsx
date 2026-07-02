import { notFound } from 'next/navigation';
import type { JSX } from 'react';

import ApiTestClient from './ApiTestClient';

// Force-dynamic: the layout chain uses `useSearchParams()` (see the home page).
export const dynamic = 'force-dynamic';

/**
 * ApiTestPage — dev performance dashboard for the OneEntry API.
 *
 * Gates the route on `NODE_ENV`: in production the page triggers `notFound()`
 * so the dashboard never ships to end users; in dev/preview the client benchmark
 * is rendered.
 * @returns {JSX.Element} JSX of the dashboard.
 */
export default function ApiTestPage(): JSX.Element {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }
  return <ApiTestClient />;
}
