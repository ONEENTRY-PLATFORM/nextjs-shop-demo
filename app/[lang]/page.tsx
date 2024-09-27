import { Suspense } from 'react';

import { getPageByUrl } from '@/app/api';
import { blocksColors, blocksData } from '@/components/data';
import BlocksGrid from '@/components/layout/home/BlocksGrid';
import Loader from '@/components/shared/Loader';

import { LanguageEnum } from '../types/enum';

// export const revalidate = 10;
// export const dynamicParams = true;

const IndexPage = async ({
  params: { lang },
}: {
  params: { lang: string };
}) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const { page, isError } = await getPageByUrl('home_web', langCode);

  if (isError || !page?.blocks) {
    return null;
  }
  const { blocks } = page;

  return (
    <main className="flex flex-col items-center justify-between gap-16 p-5 pb-16">
      <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
        <div className="flex w-full flex-col items-center gap-5 bg-white">
          <Suspense fallback={<Loader />}>
            <BlocksGrid
              blocksData={blocksData}
              blocksColors={blocksColors}
              blocks={blocks as Array<string>}
            />
          </Suspense>
        </div>
      </section>
    </main>
  );
};

export default IndexPage;
