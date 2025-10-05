import Image from 'next/image';
import type { JSX } from 'react';
import React, { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import TableRowAnimations from '../animations/TableRowAnimations';

/**
 * Delivery table row.
 * @param   {object}      props             - component props.
 * @param   {string}      props.label       - label text.
 * @param   {string}      props.value       - value text.
 * @param   {string}      props.icon        - icon url.
 * @param   {string}      props.placeholder - placeholder text in table row input.
 * @returns {JSX.Element}                   JSX.Element
 */
const DeliveryTableRow = ({
  label,
  value,
  icon,
  placeholder,
}: {
  label: string;
  value: string;
  icon: string;
  placeholder: string;
}): JSX.Element => {
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  return (
    <TableRowAnimations
      className="tr h-[50px] border-y border-solid border-[#B0BCCE] max-md:max-w-full max-md:flex-wrap"
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
            className="aspect-square w-5 cursor-pointer"
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
