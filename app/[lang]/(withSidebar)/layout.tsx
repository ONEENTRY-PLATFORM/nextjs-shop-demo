import type { JSX, ReactNode } from 'react';

import WithSidebar from '@/app/[lang]/[page]/WithSidebar';

/**
 * Persistent layout for all routes that share the left sidebar menu
 * (cart, favorites, orders, profile, payment).
 *
 * The sidebar lives in this layout — not in the individual pages — so the
 * App Router keeps its DOM mounted while navigating between these routes:
 * only the page segment below is swapped. This is what guarantees the menu
 * never unmounts, disappears or flashes a skeleton while the next page is
 * being fetched/streamed.
 * @param   {object}                    props          - Layout props.
 * @param   {ReactNode}                 props.children - Page content rendered in the main column.
 * @param   {Promise<{ lang: string }>} props.params   - Route params with the current language shortcode.
 * @returns {Promise<JSX.Element>}                     Sidebar layout wrapping the page content.
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/layout Next.js docs}
 */
const SidebarLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}): Promise<JSX.Element> => {
  const { lang } = await params;

  return (
    <section className="relative mx-auto box-border flex min-h-80 w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <WithSidebar lang={lang}>{children}</WithSidebar>
      </div>
    </section>
  );
};

export default SidebarLayout;
