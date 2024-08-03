// import type { Metadata } from 'next';
// import { notFound } from 'next/navigation';
// import { Suspense } from 'react';

import GridLayout from '@/components/layout/catalog/GridLayout';
// import Page from '@/components/layout/pages/CatalogPage';

export default async function CatalogPage({
  params,
}: {
  params: { handle: string };
}) {
  return (
    <section className="relative mx-auto box-border flex w-full max-w-[1240px] shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <GridLayout items={[]} />
      </div>
    </section>
  );
}
