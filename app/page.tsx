import { Suspense } from 'react';

import CatalogGrid from '@/components/layout/catalog/CatalogGrid';
import Loader from '@/components/shared/Loader';

import { getPageByUrl } from './api/serverSideProps';

const HomePage = async () => {
  const { page, isError } = await getPageByUrl('home_web_2', 'en_US'); // OK

  // !!! PROBLEM 2
  // const data = await getPageByUrl('home_web', 'en_US'); // BAD - не получает все поля. кеширование?
  // console.log('!1---- ' + page?.localizeInfos.title + ' ----1!');
  // console.log(page);
  // console.log('!1-----------------------------------------1!');

  // console.log('!2---- ' + data.page?.localizeInfos.title + ' ----2!');
  // console.log(data.page);
  // console.log('!2-----------------------------------------2!');
  // !!! PROBLEM 2

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
