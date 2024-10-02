import type { FC } from 'react';

import { useCreateOrder } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import Loader from '@/components/shared/Loader';

const PayOrderButton: FC<{
  lang: string;
  isLoading: boolean;
  title: string;
}> = ({ lang, isLoading, title }) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const { onConfirmOrder } = useCreateOrder({ langCode });

  return (
    <button className="btn btn-sm btn-o btn-o-primary" onClick={onConfirmOrder}>
      {title} {isLoading && <Loader />}
    </button>
  );
};

export default PayOrderButton;
