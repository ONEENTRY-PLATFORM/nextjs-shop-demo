import type { JSX, ReactNode } from 'react';

/**
 * WithSidebarLoader — skeleton wrapper mirroring the real
 * {@link app/[lang]/[page]/WithSidebar.tsx WithSidebar} layout (sidebar +
 * main content area).
 *
 * The sidebar column is intentionally left as a transparent spacer (no
 * skeleton): the left menu loads independently and has its own skeleton, so
 * the transition overlay must not cover it — the already-loaded menu stays
 * visible underneath. The content column carries only the page skeleton; the
 * old content is hidden by the transition provider, so no background is needed.
 * @param   {object}      props          - Component props.
 * @param   {ReactNode}   props.children - Main-area skeleton content.
 * @returns {JSX.Element}                Content skeleton frame (sidebar left clear).
 */
const WithSidebarLoader = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-row max-md:flex-row max-md:flex-wrap">
        {/*
         * Sidebar slot — transparent spacer only. Reserves the menu's width so
         * the content stays aligned, while the real (already-loaded) sidebar
         * menu shows through instead of a skeleton.
         */}
        <div className="w-52.5 pb-8 max-md:w-full" aria-hidden="true" />

        {/** Main content — page skeleton (old content already hidden, no background) */}
        <div className="flex w-[calc(100%-210px)] grow flex-col overflow-hidden max-md:w-full">
          <div className="flex w-full flex-col pb-5">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default WithSidebarLoader;
