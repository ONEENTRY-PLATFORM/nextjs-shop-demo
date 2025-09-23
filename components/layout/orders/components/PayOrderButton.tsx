import type { FC } from 'react';

import { useCreateOrder } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import Loader from '@/components/shared/Loader';

/**
 * PayOrder button
 * @param id
 * @param lang current language shortcode
 * @param loading
 * @param title
 *
 * @returns JSX.Element
 */
const PayOrderButton: FC<{
  id: number;
  lang: string;
  loading: boolean;
  title: string;
}> = ({ id, lang, loading, title }) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const { createSession, isLoading } = useCreateOrder({ langCode });

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
