import type { FC } from 'react';

const PaymentButton: FC<{ className?: string; text: string }> = ({
  className,
  text,
}) => {
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
