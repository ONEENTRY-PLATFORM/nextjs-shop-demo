import SidebarMenu from '@/components/layout/sidebar/SidebarMenu';

const WithSidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full flex-col items-center bg-white pb-16 pt-6">
      <div className="mx-auto flex w-full max-w-screen-xl flex-row max-sm:flex max-sm:flex-row max-sm:flex-wrap">
        <aside className="mt-1.5 w-[210px] pb-8 max-md:mt-10 max-sm:w-full">
          <SidebarMenu />
        </aside>
        <section className="flex grow flex-col max-md:mt-10 max-md:max-w-full">
          <div className="flex flex-col pb-5 max-md:max-w-full">{children}</div>
        </section>
      </div>
    </div>
  );
};

export default WithSidebar;
