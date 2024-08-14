import Breadcrumbs from '@/components/layout/breadcrumbs';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs />
      <main className="flex flex-col px-5 py-8">{children}</main>
    </>
  );
}

export default Layout;
