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
  );

  const onReset = () => {
    params.delete('search');
    params.delete('color');
    params.delete('in_stock');
    params.delete('minPrice');
    params.delete('maxPrice');
    replace(pathname);
  };

  return (
    <button
      onClick={onReset}
      className="whitespace-nowrap rounded-[30px] border border-solid border-orange-500 px-16 py-4 text-xl font-bold text-orange-500"
    >
      {reset_button_placeholder}
    </button>
  );
};

export default ResetButton;
