import type { JSX } from 'react';

import TableRowAnimations from '../animations/TableRowAnimations';

/**
 * Payment button component for proceeding to the payment process
 * Wrapped with animation component for entrance effects
 * Designed to be used in the cart and delivery forms
 * @param   {object}      props           - Payment button props
 * @param   {string}      props.className - CSS className for custom styling of the button
 * @param   {string}      props.text      - Text to display on the button
 * @returns {JSX.Element}                 Payment button component with animations
 */
const PaymentButton = ({
  className,
  text,
}: {
  className?: string;
  text: string;
}): JSX.Element => {
  return (
    /** Wrap button with animation component for entrance effects */
    <TableRowAnimations className={'mx-auto flex'} index={10}>
      {/** Payment button with submit type for form submission */}
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
