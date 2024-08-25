import Image from 'next/image';
import React from 'react';

import { deliveryTableData } from '@/components/data';

import TableRow from './DeliveryTableRow';

const DeliveryTable: React.FC = () => {
  return (
    <table className="table w-full border border-solid border-neutral-100 text-neutral-600">
      <tbody>
        {deliveryTableData.map((row, index) => (
          <TableRow
            key={index}
            label={row.label}
            value={row.value}
            icon={row.icon}
          />
        ))}
        <tr className="table-row h-[50px] gap-5 border border-solid border-neutral-100 max-md:max-w-full max-md:flex-wrap">
          <td className="table-cell align-middle">
            <Image
              loading="lazy"
              src="/icons/delivery.svg"
              alt=""
              width={30}
              height={30}
              className="aspect-[1.16] w-[125px] max-w-full shrink-0"
            />
          </td>
          <td className="table-cell px-5 align-middle">
            <div className="mt-2 flex flex-col self-start">
              <div className="text-base">Delivery</div>
              <div className="mt-4 text-xl font-bold leading-8">$ 2</div>
            </div>
          </td>
          <td className="table-cell pl-5 align-middle" />
        </tr>
      </tbody>
    </table>
  );
};

export default DeliveryTable;
