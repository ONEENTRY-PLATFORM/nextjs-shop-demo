import SidebarMenu from '../navbar/SidebarMenu';
import DeliveryTable from './DeliveryTable';
import PaymentButton from './PaymentButton';
import ProductCard from './ProductCard';
import TotalAmount from './TotalAmount';

const productsInCart = [
  {
    imageSrc: '',
    productName: 'productName',
    price: 1250,
  },
];

const CartPage = () => {
  return (
    <main className="flex w-full flex-col items-center bg-white px-5 pb-16 pt-6 max-md:px-5">
      <div className="mx-auto flex w-full max-w-screen-xl flex-row max-sm:flex max-sm:flex-row max-sm:flex-wrap">
        <aside className="mt-1.5 w-[210px] pb-8 max-md:mt-10 max-sm:w-full">
          <SidebarMenu />
        </aside>
        <section className="flex grow flex-col max-md:mt-10 max-md:max-w-full">
          <div className="flex max-w-[730px] flex-col pb-5 max-md:max-w-full">
            {productsInCart.map((product, i) => {
              return (
                <ProductCard key={i} imageSrc={''} productName={''} price={0} />
              );
            })}
            <DeliveryTable />
            <div className="mt-4 flex w-[464px] max-w-full flex-col self-end font-bold">
              <TotalAmount amount={13} />
              <PaymentButton />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default CartPage;
