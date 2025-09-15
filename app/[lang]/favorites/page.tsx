import type { FC } from 'react';

import WithSidebar from '@/app/[lang]/[page]/WithSidebar';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import type { PageProps } from '@/app/types/global';
import FavoritesPage from '@/components/layout/favorites';
import type { Locale } from '@/i18n-config';

import { getDictionary } from '../dictionaries';

/**
 * Favorites page
 * @async server component
 * @param params page params
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @returns Favorites page layout JSX.Element
 */
const FavoritesPageLayout: FC<PageProps> = async ({ params }) => {
  const { lang } = await params;
  // Get dictionary and set to server provider
  const [dict] = ServerProvider('dict', await getDictionary(lang as Locale));

  return (
    <section className="relative mx-auto box-border flex min-h-80 w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <WithSidebar lang={lang}>
          <FavoritesPage lang={lang} dict={dict} />
        </WithSidebar>
      </div>
    </section>
  );
};

export default FavoritesPageLayout;
