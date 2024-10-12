import Breadcrumbs from '@/components/layout/breadcrumbs/Breadcrumbs';

function Layout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <div className="flex w-full flex-col">
      <Breadcrumbs lang={lang} withFilter={true} />
      <main className="flex w-full flex-col gap-16 p-5 pb-10">{children}</main>
    </div>
  );
}

export default Layout;
