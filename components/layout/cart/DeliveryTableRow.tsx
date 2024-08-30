/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import React from 'react';

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
}) => (
  <tr className="table-row h-[50px] gap-5 max-md:max-w-full max-md:flex-wrap">
    <td className="self-stretch align-middle text-sm">{label}</td>
    <td className="px-5 align-middle text-base">
      <input type="text" value={value} placeholder={placeholder} disabled />
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

export default TableRow;
