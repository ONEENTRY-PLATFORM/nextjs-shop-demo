import type { JSX, ReactNode } from 'react';

import FadeTransition from '@/app/animations/FadeTransition';
import SidebarMenu from '@/components/layout/sidebar';

/**
 * Sidebar layout component that provides a responsive layout with a sidebar menu
 * and main content area. This is an async server component that supports
 * internationalization through the lang parameter.
 * @async
 * @param   {object}               props          - Props for the component
 * @param   {string}               props.lang     - Current language shortcode for internationalization
 * @param   {ReactNode}            props.children - Child components to be rendered in the main content area
 * @returns {Promise<JSX.Element>}                Sidebar layout JSX.Element with responsive sidebar and main content area
 */
const WithSidebar = async ({
  lang,
  children,
}: {
  lang: string;
  children: ReactNode;
}): Promise<JSX.Element> => {
  return (
    <div className="flex w-full flex-col items-center">
      {/*
       * Main container with max width constraint and responsive flex layout
       * On mobile devices, elements wrap to separate rows
       */}
      <div className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-row max-md:flex-row max-md:flex-wrap">
        {/*
         * Sidebar container. The menu is server-rendered (resolved in the RSC),
         * so it's already present when a page mounts — during a transition only
         * the content column is hidden, never this sidebar, so the menu doesn't
         * disappear or flash a skeleton between sidebar pages.
         */}
        <aside className="w-52.5 pb-8 max-md:w-full">
          <SidebarMenu lang={lang} />
        </aside>
        {/*
         * Main content area with fade transition animation. Marked
         * `data-transition-content` so the transition provider hides only this
         * column (not the sidebar) while navigating.
         */}
        <FadeTransition
          className="flex w-[calc(100%-210px)] grow flex-col overflow-hidden max-md:w-full"
          index={0}
        >
          <div className="flex w-full flex-col pb-5" data-transition-content="">
            {children}
          </div>
        </FadeTransition>
      </div>
    </div>
  );
};

export default WithSidebar;
