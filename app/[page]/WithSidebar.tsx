import SidebarMenu from '@/components/layout/sidebar/SidebarMenu';

const WithSidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="mx-auto flex w-full max-w-screen-xl flex-row max-sm:flex-row max-sm:flex-wrap">
        <aside className="w-[210px] pb-8 max-sm:w-full">
          <SidebarMenu />
        </aside>
        <section className="flex w-full grow flex-col">
          <div className="flex w-full flex-col pb-5">{children}</div>
        </section>
      </div>
    </div>
  );
};

export default WithSidebar;
