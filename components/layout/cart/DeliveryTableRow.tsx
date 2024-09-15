/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image';
import type { IAttributes } from 'oneentry/dist/base/utils';
import type { FC } from 'react';
import React, { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

interface TableRowProps {
  field: IAttributes;
  label: string;
  value: string;
  placeholder: string;
  icon?: string;
}

const DeliveryTableRow: FC<TableRowProps> = ({
  field,
  label,
  value,
  icon,
  placeholder,
}) => {
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  return (
    <tr className="table-row h-[50px] gap-5 border-t border-solid border-[#B0BCCE] max-md:max-w-full max-md:flex-wrap">
      <td className="self-stretch align-middle text-sm">
        <label htmlFor={'label-' + placeholder}>{label}</label>
      </td>
      <td className="px-5 align-middle text-base">
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          readOnly
          id={'label-' + placeholder}
          name={placeholder}
          onClick={() => {
            setOpen(true);
            setComponent('CalendarForm');
          }}
          className="w-full"
        />
      </td>
      <td className="table-cell pl-5 align-middle">
        {icon && (
          <Image
            width={20}
            height={20}
            loading="lazy"
            src={icon}
            alt={placeholder}
            className="aspect-square w-5"
            onClick={() => {
              setOpen(true);
              setComponent('CalendarForm');
            }}
          />
        )}
      </td>
    </tr>
  );
};

export default DeliveryTableRow;
