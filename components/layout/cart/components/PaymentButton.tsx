import { type FC, useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';

const PaymentButton: FC<{ className?: string }> = (className) => {
  const [goToText, setGoToText] = useState('');

  const { go_to_pay_placeholder } = useAppSelector(
    (state) => state.systemContentReducer.content,
  );
  useEffect(() => {
    if (go_to_pay_placeholder) {
      setGoToText(go_to_pay_placeholder.value);
    }
  }, [go_to_pay_placeholder]);

  return (
    <button
      type="submit"
      onClick={() => {}}
      className={'btn btn-lg btn-primary mt-9 self-center px-16 ' + className}
    >
      {goToText}
    </button>
  );
};

export default PaymentButton;
