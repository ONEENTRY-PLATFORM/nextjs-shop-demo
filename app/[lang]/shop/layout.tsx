import Breadcrumbs from '@/components/layout/breadcrumbs';

function Layout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <>
      <Breadcrumbs lang={lang} />
      <main className="flex w-full flex-col gap-16 p-5 pb-10">{children}</main>
    </>
  );
}

export default Layout;
