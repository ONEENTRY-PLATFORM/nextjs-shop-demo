import Image from 'next/image';
import React from 'react';

import TableRow from './DeliveryTableRow';

const DeliveryTable: React.FC = () => {
  return (
    <table className="table w-full border border-solid border-neutral-100 text-neutral-600">
      <tbody>
        <TableRow
          label={'Date'}
          value={'09.10.2023'}
          icon={'/icons/calendar.svg'}
          placeholder={'Select date'}
        />
        <TableRow
          label={'Time'}
          value={'19.00'}
          icon={'/icons/time.svg'}
          placeholder={'Select time'}
        />
        <TableRow
          label={'Address'}
          value={'Dubai, One Entry street, 50'}
          placeholder={'Address'}
        />
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
