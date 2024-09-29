import type { ReactNode } from 'react';

import Breadcrumbs from '@/components/layout/breadcrumbs';

function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Breadcrumbs />
      <main className="flex flex-col p-5">{children}</main>
    </>
  );
}

export default Layout;
