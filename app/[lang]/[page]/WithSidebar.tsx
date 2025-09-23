import type { FC } from 'react';

import FadeTransition from '@/app/animations/FadeTransition';
import SidebarMenu from '@/components/layout/sidebar';

/**
 * Sidebar layout
 *
 * @async server component
 * @param lang Current language shortcode
 * @param children children ReactNode
 * @returns Sidebar layout JSX.Element
 */
const WithSidebar: FC<{
  lang: string;
  children: React.ReactNode;
}> = async ({ lang, children }) => {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-row max-md:flex-row max-md:flex-wrap">
        <aside className="w-[210px] pb-8 max-md:w-full">
          <SidebarMenu lang={lang} />
        </aside>
        <FadeTransition
          className="flex w-[calc(100%-210px)] grow flex-col overflow-hidden max-md:w-full"
          index={0}
        >
          <div className="flex w-full flex-col pb-5">{children}</div>
        </FadeTransition>
      </div>
    </div>
  );
};

export default WithSidebar;
