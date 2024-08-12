import Breadcrumbs from '@/components/layout/breadcrumbs';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs />
      <main className="flex flex-col ">{children}</main>
    </>
  );
}

export default Layout;
