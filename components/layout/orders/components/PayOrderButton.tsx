import type { JSX } from 'react';

import { useCreateOrder } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import Loader from '@/components/shared/Loader';

/**
 * PayOrder button
 * @param   {object}      props         - component props
 * @param   {number}      props.id      - order id
 * @param   {string}      props.lang    - current language shortcode
 * @param   {boolean}     props.loading - loading state
 * @param   {string}      props.title   - button title
 * @returns {JSX.Element}               JSX.Element
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
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { createSession, isLoading }: any = useCreateOrder({ langCode });

  return (
    <button
      onClick={() => createSession(id)}
      type="button"
      className="btn btn-sm btn-o btn-o-primary"
    >
      {title} {(isLoading || loading) && <Loader />}
    </button>
  );
};

export default PayOrderButton;
