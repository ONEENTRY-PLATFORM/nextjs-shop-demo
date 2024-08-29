import Breadcrumbs from '@/components/layout/breadcrumbs';
import ModalLayout from '@/components/layout/filter/ModalLayout';

function Layout({ children }: { children: React.ReactNode }) {
  console.log('params');
  return (
    <>
      <Breadcrumbs />
      <main className="flex w-full flex-col gap-16 px-5 py-8">{children}</main>
      <ModalLayout />
    </>
  );
}

export default Layout;
