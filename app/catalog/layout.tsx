import Breadcrumbs from '@/components/layout/breadcrumbs';
import FiltersForm from '@/components/layout/filter/FiltersForm';
import ModalLayout from '@/components/layout/filter/ModalLayout';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs />
      <main className="flex w-full flex-col gap-16 px-5 py-8">{children}</main>
      <ModalLayout>
        <FiltersForm />
      </ModalLayout>
    </>
  );
}

export default Layout;
