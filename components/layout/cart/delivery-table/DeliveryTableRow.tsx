import Image from 'next/image';
import type { JSX } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import TableRowAnimations from '../animations/TableRowAnimations';

/**
 * Delivery table row component that displays a single row in the delivery information table
 * Provides interaction to open calendar form when clicked
 * @param   {object}      props             - component props
 * @param   {string}      props.label       - label text displayed next to the input field
 * @param   {string}      props.value       - current value displayed in the input field
 * @param   {string}      props.icon        - icon url to display at the end of the row
 * @param   {string}      props.placeholder - placeholder text in table row input field
 * @returns {JSX.Element}                   Delivery table row with label, value and optional icon
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
  /** Get functions to control the drawer state from context */
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  return (
    /** Wrap row with animation component for staggered entrance effects */
    <TableRowAnimations
      className="tr h-[50px] border-y border-solid border-[#B0BCCE] max-md:max-w-full max-md:flex-wrap"
      index={7}
    >
      {/** Label cell for the input field */}
      <div className="td w-3/12 align-middle text-sm">
        <label className="my-auto h-5" htmlFor={'label-' + placeholder}>
          {label}
        </label>
      </div>

      {/** Value input field cell - readonly, opens calendar form when clicked */}
      <div className="td w-8/12 px-5 align-middle text-base">
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          readOnly
          id={'label-' + placeholder}
          name={placeholder}
          onClick={() => {
            /** Open drawer and set component to CalendarForm when input is clicked */
            setOpen(true);
            setComponent('CalendarForm');
          }}
          className="w-full"
        />
      </div>

      {/** Icon cell - displays optional icon that also opens calendar form when clicked */}
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
              /** Open drawer and set component to CalendarForm when icon is clicked */
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
