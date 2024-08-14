import { productsInCart } from '@/components/data';
import DeliveryTable from '@/components/layout/cart/DeliveryTable';
import PaymentButton from '@/components/layout/cart/PaymentButton';
import ProductCard from '@/components/layout/cart/ProductCard';
import TotalAmount from '@/components/layout/cart/TotalAmount';

const CartPage = () => {
  return (
    <div className="flex max-w-[730px] flex-col pb-5 max-md:max-w-full">
      {productsInCart.map((product, i) => {
        return <ProductCard key={i} product={product} />;
      })}
      <DeliveryTable />
      <div className="mt-4 flex w-[464px] max-w-full flex-col self-end font-bold">
        <TotalAmount amount={13} />
        <PaymentButton />
      </div>
    </div>
  );
};

export default CartPage;
