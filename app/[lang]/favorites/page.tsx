import type { FC } from 'react';

import WithSidebar from '@/app/[lang]/[page]/WithSidebar';
import { useServerProvider } from '@/app/store/providers/ServerProvider';
import FavoritesPage from '@/components/layout/favorites';
import type { Locale } from '@/i18n-config';

import { getDictionary } from '../dictionaries';

const Page: FC<{
  params: { page: string; lang: string };
}> = async ({ params: { lang } }) => {
  const [dict] = useServerProvider('dict', await getDictionary(lang as Locale));
  return (
    <section className="relative mx-auto box-border flex min-h-80 w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <WithSidebar lang={lang}>
          <FavoritesPage lang={lang} dict={dict} />
        </WithSidebar>
      </div>
    </section>
  );
};

export default Page;
