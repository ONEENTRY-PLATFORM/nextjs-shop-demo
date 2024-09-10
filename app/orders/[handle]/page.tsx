import WithSidebar from '@/app/[page]/WithSidebar';
import OrderPage from '@/components/layout/orders/OrderPage';

export default function CatalogPage({
  params,
}: {
  params: { handle: string };
}) {
  return (
    <section className="relative mx-auto box-border flex min-h-80 w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <WithSidebar>
          <OrderPage id={Number(params.handle)} />
        </WithSidebar>
      </div>
    </section>
  );
}
