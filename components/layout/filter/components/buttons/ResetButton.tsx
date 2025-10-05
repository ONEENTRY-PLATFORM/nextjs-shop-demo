'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

/**
 * ResetButton.
 * @param   {object}           props      - props.
 * @param   {IAttributeValues} props.dict - dictionary from server api.
 * @returns {JSX.Element}                 ResetButton.
 */
const ResetButton = ({ dict }: { dict: IAttributeValues }): JSX.Element => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.delete('in_stock');
    params.delete('color');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('search');
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <button
      onClick={handleClick}
      className="btn btn-o btn-o-gray relative box-border flex h-12 w-full shrink-0 flex-col items-center justify-center rounded-3xl px-5 py-3 text-center text-base font-medium uppercase"
    >
      {dict?.filter_reset_button?.value || 'Reset'}
    </button>
  );
};

export default ResetButton;
