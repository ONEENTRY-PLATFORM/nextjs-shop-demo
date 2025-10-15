import type { JSX } from 'react';

import { useCreateOrder } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import Loader from '@/components/shared/Loader';

/**
 * PayOrder button component.
 * Provides a button that initiates the payment process for an order using Stripe.
 * @param   {object}      props         - Component props
 * @param   {number}      props.id      - Order ID to create payment session for
 * @param   {string}      props.lang    - Current language shortcode for localization
 * @param   {boolean}     props.loading - Loading state to show spinner when processing
 * @param   {string}      props.title   - Button title text
 * @returns {JSX.Element}               Payment button element with loading indicator
 */
const PayOrderButton = ({
  id,
  lang,
  loading,
  title,
}: {
  id: number;
  lang: string;
  loading: boolean;
  title: string;
}): JSX.Element => {
  /** Convert language shortcode to enum value for API requests */
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  /** Get payment session creation function and loading state from custom hook */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { createSession, isLoading }: any = useCreateOrder({ langCode });

  /* Render the payment button */
  return (
    <button
      onClick={() => createSession(id)}
      type="button"
      className="btn btn-sm btn-o btn-o-primary"
    >
      {/* Display button title and loading spinner when processing */}
      {title} {(isLoading || loading) && <Loader />}
    </button>
  );
};

export default PayOrderButton;
