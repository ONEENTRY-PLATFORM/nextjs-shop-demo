import { Suspense } from 'react';

import { getPageByUrl } from '@/app/api';
import BlocksGrid from '@/components/layout/home/BlocksGrid';
import { BlocksGridLoader } from '@/components/shared/Loader';

// export const revalidate = 10;
// export const dynamicParams = true;

const IndexPage = async ({
  params: { lang },
}: {
  params: { lang: string };
}) => {
  const { page, isError } = await getPageByUrl('home_web', lang);

  if (isError || !page || !page.blocks) {
    return 'isError';
  }
  const { blocks } = page;

  return (
    <main className="flex flex-col items-center justify-between gap-16 p-5 pb-16">
      <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
        <div className="flex w-full flex-col items-center gap-5 bg-white">
          <Suspense fallback={<BlocksGridLoader />}>
            <BlocksGrid blocks={blocks as Array<string>} lang={lang} />
          </Suspense>
        </div>
      </section>
    </main>
  );
};

export default IndexPage;
