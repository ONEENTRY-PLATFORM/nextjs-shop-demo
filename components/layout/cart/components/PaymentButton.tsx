import type { FC } from 'react';

import TableRowAnimations from '../animations/TableRowAnimations';

interface PaymentButtonProps {
  className?: string;
  text: string;
}

/**
 * Payment button
 * @param className CSS className of ref element
 * @param text
 *
 * @returns
 */
const PaymentButton: FC<PaymentButtonProps> = ({ className, text }) => {
  return (
    <TableRowAnimations className={'mx-auto flex'} index={10}>
      <button
        type="submit"
        onClick={() => {}}
        className={'btn btn-lg btn-primary mt-9 self-center px-16 ' + className}
        title={text}
      >
        {text}
      </button>
    </TableRowAnimations>
  );
};

export default PaymentButton;
