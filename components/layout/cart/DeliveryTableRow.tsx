import Image from 'next/image';
import React, { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

interface TableRowProps {
  label: string;
  value: string;
  placeholder: string;
  icon?: string;
}

const TableRow: React.FC<TableRowProps> = ({
  label,
  value,
  icon,
  placeholder,
}) => {
  const { setOpen, setComponent } = useContext(OpenDrawerContext);
  return (
    <tr className="table-row h-[50px] gap-5 max-md:max-w-full max-md:flex-wrap">
      <td className="self-stretch align-middle text-sm">{label}</td>
      <td className="px-5 align-middle text-base">
        <input
          size={40}
          type="text"
          value={value}
          placeholder={placeholder}
          onClick={() => {
            setOpen(true);
            setComponent('CalendarForm');
          }}
        />
      </td>
      <td className="table-cell pl-5 align-middle">
        {icon && (
          <Image
            width={20}
            height={20}
            loading="lazy"
            src={icon}
            alt=""
            className="aspect-square w-5"
          />
        )}
      </td>
    </tr>
  );
};

export default TableRow;
