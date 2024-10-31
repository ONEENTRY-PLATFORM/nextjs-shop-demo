import Link from 'next/link';

import { getPageByUrl } from '@/app/api';

const NotFound = async () => {
  const lang = 'en';
  const { page, isError } = await getPageByUrl('404', lang);

  if (isError || !page) {
    return (
      <div className="mx-auto flex min-h-80 w-full max-w-screen-xl flex-col items-center justify-center py-8">
        <h1 className="mb-10 text-6xl">404</h1>
        <Link href="/">Return home</Link>
      </div>
    );
  }

  const { localizeInfos, attributeValues } = page;

  return (
    <div className="mx-auto flex min-h-96 w-full max-w-screen-xl flex-col items-center justify-center py-8 text-neutral-700">
      <h1 className="mb-10 text-6xl">{localizeInfos?.title}</h1>
      <p className="mb-4">
        {attributeValues?.error_description?.value[0]?.plainValue}
      </p>
      <Link href="/" className="btn btn-o btn-sm btn-o-primary">
        Return home
      </Link>
    </div>
  );
};

export default NotFound;
