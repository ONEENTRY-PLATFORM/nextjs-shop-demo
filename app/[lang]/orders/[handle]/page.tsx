import type { Metadata } from 'next';
import type { FC } from 'react';

import WithSidebar from '@/app/[lang]/[page]/WithSidebar';
import OrderPage from '@/components/layout/orders/components/OrderPage';

/**
 * Order page layout
 * @async server component
 * @param params page params
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @returns Order page layout JSX.Element
 */

const OrderPageLayout = async (
  props: Promise<{
    params: { handle: string; lang: string };
  }>,
) => {
  const p = await props;
  const { handle, lang } = p.params;

  return (
    <section className="relative mx-auto box-border flex min-h-80 w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <WithSidebar lang={lang}>
          <OrderPage
            id={Number(handle)}
            settings={undefined}
            lang={lang}
            isActive={false}
          />
        </WithSidebar>
      </div>
    </section>
  );
};

export default OrderPageLayout;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string; lang: string }>;
}): Promise<Metadata> {
  const { handle, lang } = await params;
  const title = `Заказ #${handle} — OneEntry Shop`;
  const description = 'Детали заказа и статус оплаты.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${lang}/orders/${handle}`,
      type: 'article',
    },
    alternates: {
      canonical: `/${lang}/orders/${handle}`,
    },
  };
}
