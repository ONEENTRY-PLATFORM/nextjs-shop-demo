import type { FC } from 'react';

interface PaymentButtonProps {
  className?: string;
  text: string;
}

const PaymentButton: FC<PaymentButtonProps> = ({ className, text }) => {
  return (
    <button
      type="submit"
      onClick={() => {}}
      className={'btn btn-lg btn-primary mt-9 self-center px-16 ' + className}
      title={text}
    >
      {text}
    </button>
  );
};

export default PaymentButton;
