import type { FC } from 'react';

const PaymentButton: FC<{ className?: string }> = (className) => {
  return (
    <button
      type="submit"
      onClick={() => {}}
      className={'btn btn-lg btn-primary mt-9 self-center px-16 ' + className}
    >
      GO TO PAY
    </button>
  );
};

export default PaymentButton;
