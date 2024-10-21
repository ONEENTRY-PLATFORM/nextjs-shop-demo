'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { FC } from 'react';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ResetButton: FC<{ dict: any }> = ({ dict }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const { reset_button_placeholder } = dict;

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
      {reset_button_placeholder?.value}
    </button>
  );
};

export default ResetButton;
