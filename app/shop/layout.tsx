import Breadcrumbs from '@/components/layout/breadcrumbs';
import ModalLayout from '@/components/layout/filter/ModalLayout';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs />
      <main className="flex w-full flex-col gap-16 p-5 pb-10">{children}</main>
      <ModalLayout />
    </>
  );
}

export default Layout;
