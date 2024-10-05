import type { ReactNode } from 'react';

import Breadcrumbs from '@/components/layout/breadcrumbs/Breadcrumbs';

async function Layout({
  children,
  params: { lang },
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  return (
    <>
      <Breadcrumbs lang={lang} withFilter={false} />
      <main className="flex flex-col p-5">{children}</main>
    </>
  );
}

export default Layout;
