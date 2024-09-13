import Link from 'next/link';
import type { FC } from 'react';

const PaymentButton: FC = () => {
  return (
    <Link
      href="/payment"
      className="mt-9 self-center rounded-[30px] border border-solid border-orange-500 bg-orange-500 px-16 py-4 text-base uppercase text-white max-md:px-8 max-md:py-3 lg:self-start"
    >
      GO TO PAY
    </Link>
  );
};

export default PaymentButton;
