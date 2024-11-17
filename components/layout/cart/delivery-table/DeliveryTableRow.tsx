import Image from 'next/image';
import type { IAttributes } from 'oneentry/dist/base/utils';
import type { FC } from 'react';
import React, { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import TableRowAnimations from '../animations/TableRowAnimations';

interface TableRowProps {
  field: IAttributes;
  label: string;
  value: string;
  placeholder: string;
  icon?: string;
}

/**
 * Delivery table row
 * @param label
 * @param value
 * @param icon icon url
 * @param placeholder placeholder text in table row input
 *
 * @returns
 */
const DeliveryTableRow: FC<TableRowProps> = ({
  // field,
  label,
  value,
  icon,
  placeholder,
}) => {
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  return (
    <TableRowAnimations
      className="tr h-[50px] border-t border-solid border-[#B0BCCE] max-md:max-w-full max-md:flex-wrap"
      index={7}
    >
      <div className="td w-3/12 align-middle text-sm">
        <label className="my-auto h-5" htmlFor={'label-' + placeholder}>
          {label}
        </label>
      </div>
      <div className="td w-8/12 px-5 align-middle text-base">
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
      </div>
      <div className="td w-1/12 pl-5 align-middle">
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
      </div>
    </TableRowAnimations>
  );
};

export default DeliveryTableRow;
