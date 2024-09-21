import Link from 'next/link';

import { getPageByUrl } from './api/serverSideProps';

export default async function NotFound() {
  const { page, isError } = await getPageByUrl('404', 'en_US');

  if (isError || !page) {
    return (
      <div className="mx-auto flex min-h-80 w-full max-w-screen-xl flex-col items-center justify-center py-8">
        <h2 className="mb-10 text-6xl">404</h2>
        <Link href="/">Return Home</Link>
      </div>
    );
  }

  const { localizeInfos, attributeValues } = page;

  return (
    <div className="mx-auto flex min-h-96 w-full max-w-screen-xl flex-col items-center justify-center py-8">
      <h2 className="mb-10 text-6xl">{localizeInfos.title}</h2>
      <p className="mb-4">
        {attributeValues.error_description.value[0].plainValue}
      </p>
      <Link href="/" className="btn btn-o btn-sm btn-o-primary">
        Return Home
      </Link>
    </div>
  );
}
