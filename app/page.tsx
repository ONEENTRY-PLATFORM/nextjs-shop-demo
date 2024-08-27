import { Suspense } from 'react';

import CatalogGrid from '@/components/layout/catalog/CatalogGrid';
import Loader from '@/components/shared/Loader';

import { getPageByUrl } from './api/serverSideProps';

export const revalidate = 10;
export const dynamicParams = true;

const HomePage = async ({ params }: { params: { handle: string } }) => {
  const { page, isError } = await getPageByUrl('home_web_2', 'en_US');
  console.log(params);

  if (isError || !page?.blocks) {
    return null;
  }

  return (
    <main className="flex flex-col items-center justify-between gap-16 px-5 py-8">
      <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
        <div className="flex w-full flex-col items-center gap-5 bg-white">
          <Suspense fallback={<Loader />}>
            <CatalogGrid blocks={page.blocks} />
          </Suspense>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
