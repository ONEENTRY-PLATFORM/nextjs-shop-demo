'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FC } from 'react';
import React from 'react';

/**
 * Reset filter button
 * @param dict dictionary from server api
 *
 * @returns ResetButton
 */
const ResetButton: FC<{ dict: IAttributeValues }> = ({ dict }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const { reset_button_placeholder } = dict;

  const onResetHandle = () => {
    params.delete('search');
    params.delete('color');
    params.delete('in_stock');
    params.delete('minPrice');
    params.delete('maxPrice');
    replace(pathname);
  };

  return (
    <button
      onClick={onResetHandle}
      className="btn btn-xl btn-o btn-o-primary w-full"
    >
      {reset_button_placeholder?.value}
    </button>
  );
};

export default ResetButton;
