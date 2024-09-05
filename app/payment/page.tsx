import PaymentPage from '@/components/layout/payment/PaymentPage';

import WithSidebar from '../[page]/WithSidebar';

export const revalidate = 10;
export const dynamicParams = true;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Page = async ({ params }: { params: { handle: string } }) => {
  return (
    <section className="relative mx-auto box-border flex min-h-80 w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <WithSidebar>
          <PaymentPage />
        </WithSidebar>
      </div>
    </section>
  );
};

export default Page;
