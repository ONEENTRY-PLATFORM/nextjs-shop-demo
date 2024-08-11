import { Suspense } from 'react';

import { catalogCards } from '@/components/data';
import CatalogGrid from '@/components/layout/catalog/CatalogGrid';

export default async function Home() {
  // const pages = await getPages('en_US');

  return (
    <main className="flex flex-col items-center justify-between gap-16 px-5 py-8">
      <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
        <div className="flex w-full flex-col items-center gap-5 bg-white">
          <div className="">
            <Suspense
              fallback={
                <div className="relative aspect-square size-full max-h-[550px] overflow-hidden" />
              }
            />
          </div>
          <CatalogGrid cards={catalogCards} />
        </div>
      </section>
    </main>
  );
}
