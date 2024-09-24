import { Suspense } from 'react';

import { getPageByUrl } from '@/app/api';
import BlocksGrid from '@/components/layout/home/BlocksGrid';
import Loader from '@/components/shared/Loader';

// export const revalidate = 10;
// export const dynamicParams = true;

const HomePage = async () => {
  const { page, isError } = await getPageByUrl('home_web', 'en_US');

  if (isError || !page?.blocks) {
    return null;
  }
  const { blocks } = page;

  const blocksData = [
    // home_banner:
    {
      width: 'w-full max-sm:flex-col',
      height: 'h-[175px]',
    },
    // offer_best_seller:
    {
      width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
    },
    // offer_promotion:
    {
      width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
    },
    // offer_offer_day:
    {
      width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
    },
    // offer_new_arrivals:
    {
      width: 'w-full md:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
    },
    // offer_youtube:
    {
      width: 'w-full lg:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
    },
  ];
  const blocksColors = {
    home_banner: 'bg-amber-600 w-full max-sm:flex-col',
    offer_best_seller: 'bg-purple-600',
    offer_promotion: 'bg-blue-500',
    offer_offer_day: 'bg-lime-700',
    offer_new_arrivals: 'bg-teal-300',
    offer_youtube: 'bg-amber-300',
  };

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

export default HomePage;
