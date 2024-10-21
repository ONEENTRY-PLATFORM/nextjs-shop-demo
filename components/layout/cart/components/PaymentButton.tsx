import type { FC } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PaymentButton: FC<{ className?: string; dict: any }> = ({
  className,
  dict,
}) => {
  const { go_to_pay_placeholder } = dict;

  return (
    <button
      type="submit"
      onClick={() => {}}
      className={'btn btn-lg btn-primary mt-9 self-center px-16 ' + className}
    >
      {go_to_pay_placeholder?.value}
    </button>
  );
};

export default PaymentButton;
