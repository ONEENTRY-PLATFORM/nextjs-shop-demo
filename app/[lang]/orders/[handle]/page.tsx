import type { FC } from 'react';

import WithSidebar from '@/app/[lang]/[page]/WithSidebar';
import OrderPage from '@/components/layout/orders/components/OrderPage';

const CatalogPage: FC<{ params: { handle: string; lang: string } }> = ({
  params: { handle, lang },
}) => {
  return (
    <section className="relative mx-auto box-border flex min-h-80 w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <WithSidebar lang={lang}>
          <OrderPage id={Number(handle)} settings={undefined} lang={lang} />
        </WithSidebar>
      </div>
    </section>
  );
};

export default CatalogPage;
