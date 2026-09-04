import type { JSX } from 'react';

import Loader from '@/components/shared/Loader';

/**
 * Loading component that displays a loader spinner while the page is loading.
 * This is a React functional component that renders a Loader component.
 *
 * A spinner rather than a skeleton, deliberately: this route dispatches to
 * seven different page components by `templateIdentifier` (about, contacts,
 * delivery, services, book-online, payment success/canceled), so there is no
 * single layout to mirror. A skeleton shaped like one of them would cause the
 * layout shift it is meant to prevent on the other six.
 *
 * Note also that this boundary makes the sibling `notFound()` answer 200
 * instead of 404: the shell is flushed before the page resolves, so the status
 * is already sent when `notFound()` throws — the 404 markup still renders. Same
 * trade-off as `shop/category` and `shop/product/[handle]`; verified on
 * production builds of the sibling projects. Do not add a `loading.tsx` to a
 * segment that must return a real 404 without re-deciding this.
 * @returns {JSX.Element} A Loader component to indicate loading state
 */
export default function Loading(): JSX.Element {
  return <Loader />;
}
