import { Suspense } from 'react';

import { useGetPageByUrl } from '@/app/api';
import CatalogGrid from '@/components/layout/home/CatalogGrid';
import Loader from '@/components/shared/Loader';

// export const revalidate = 10;
// export const dynamicParams = true;

const HomePage = async () => {
  const { page, isError } = await useGetPageByUrl('home_web', 'en_US');

  if (isError || !page?.blocks) {
    return null;
  }
  const { blocks } = page;

  const blocksData = {
    home_banner: {
      class_name: 'bg-amber-600 max-sm:flex-col',
      width: 'w-full',
      height: 'h-[175px]',
    },
    offer_best_seller: {
      class_name: 'bg-purple-600',
      width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
    },
    offer_promotion: {
      class_name: 'bg-blue-500',
      width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
    },
    offer_offer_day: {
      class_name: 'bg-lime-700',
      width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
    },
    offer_new_arrivals: {
      class_name: 'bg-teal-300',
      width: 'w-full md:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
    },
    offer_youtube: {
      class_name: 'bg-amber-300',
      width: 'w-full lg:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
    },
  };

  return (
    <main className="flex flex-col items-center justify-between gap-16 p-5 pb-16">
      <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
        <div className="flex w-full flex-col items-center gap-5 bg-white">
          <Suspense fallback={<Loader />}>
            <CatalogGrid
              classNames={blocksData}
              blocks={blocks as Array<string>}
            />
          </Suspense>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
