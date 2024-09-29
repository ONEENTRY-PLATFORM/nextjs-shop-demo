import Breadcrumbs from '@/components/layout/breadcrumbs';

async function Layout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <>
      <Breadcrumbs lang={lang} />
      <main className="flex flex-col p-5">{children}</main>
    </>
  );
}

export default Layout;
