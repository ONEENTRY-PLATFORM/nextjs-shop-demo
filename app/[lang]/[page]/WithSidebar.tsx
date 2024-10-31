import FadeTransition from '@/app/animations/FadeTransition';
import SidebarMenu from '@/components/layout/sidebar';

const WithSidebar = async ({
  lang,
  children,
}: {
  lang: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="mx-auto flex w-full max-w-screen-xl flex-row max-md:flex-row max-md:flex-wrap">
        <aside className="w-[210px] pb-8 max-md:w-full">
          <SidebarMenu lang={lang} />
        </aside>
        <FadeTransition
          className="flex w-[calc(_100%_-_210px_)] grow flex-col max-md:w-full"
          index={0}
        >
          <div className="flex w-full flex-col pb-5">{children}</div>
        </FadeTransition>
      </div>
    </div>
  );
};

export default WithSidebar;
