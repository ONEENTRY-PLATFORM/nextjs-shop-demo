import type { FC } from 'react';

import WithSidebar from '@/app/[lang]/[page]/WithSidebar';
import type { PageProps } from '@/app/types/global';
import OrderPage from '@/components/layout/orders/components/OrderPage';

/**
 * Order page layout
 * @async server component
 * @param params page params
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @returns Order page layout JSX.Element
 */
const OrderPageLayout: FC<PageProps> = async (props) => {
  const params = await props.params;

  const { handle, lang } = params;

  return (
    <section className="relative mx-auto box-border flex min-h-80 w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
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
