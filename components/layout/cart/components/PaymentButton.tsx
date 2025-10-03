import type { FC } from 'react';

import TableRowAnimations from '../animations/TableRowAnimations';

/**
 * Payment button props
 *
 * @property className - CSS className of ref element
 * @property text - Button text
 */
interface PaymentButtonProps {
  className?: string;
  text: string;
}

/**
 * Payment button
 *
 * @param props - Payment button props
 * @param props.className - CSS className of ref element
 * @param props.text - Button text
 *
 * @returns Payment button component
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
