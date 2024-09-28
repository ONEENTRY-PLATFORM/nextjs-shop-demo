import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { FC } from 'react';
import React from 'react';

import { useAppSelector } from '@/app/store/hooks';

const ResetButton: FC = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const { reset_button_placeholder } = useAppSelector(
    (state) => state.systemContentReducer.content,
  ) as {
    reset_button_placeholder: {
      value: string;
    };
  };

  const onReset = () => {
    params.delete('search');
    params.delete('color');
    params.delete('in_stock');
    params.delete('minPrice');
    params.delete('maxPrice');
    replace(pathname);
  };

  return (
    <button onClick={onReset} className="btn btn-xl btn-o btn-o-primary">
      {reset_button_placeholder.value}
    </button>
  );
};

export default ResetButton;
