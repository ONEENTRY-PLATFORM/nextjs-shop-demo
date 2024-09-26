import Breadcrumbs from '@/components/layout/breadcrumbs';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs />
      <main className="flex w-full flex-col gap-16 p-5 pb-10">{children}</main>
    </>
  );
}

export default Layout;
