/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface TableRowProps {
  label: string;
  value: string;
  icon?: string;
}

const TableRow: React.FC<TableRowProps> = ({ label, value, icon }) => (
  <tr className="table-row h-[50px] gap-5 border border-solid border-[black] max-md:max-w-full max-md:flex-wrap">
    <td className="self-stretch align-middle text-sm">{label}</td>
    <td className="px-5 align-middle text-base">{value}</td>
    <td className="table-cell pl-5 align-middle">
      {icon && (
        <img loading="lazy" src={icon} alt="" className="aspect-square w-5" />
      )}
    </td>
  </tr>
);

export default TableRow;
