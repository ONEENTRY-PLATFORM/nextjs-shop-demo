import React from 'react';

import DeliveryRow from './DeliveryRow';
import TableRow from './TableRow';

const tableData = [
  {
    label: 'Date',
    value: '09.10.2023',
    icon: '/icons/calendar.svg',
  },
  {
    label: 'Time',
    value: '19:00',
    icon: '/icons/time.svg',
  },
  { label: 'Address', value: 'Dubai, One Entry street, 50' },
];

const DeliveryTable: React.FC = () => {
  return (
    <table className="table w-full border border-solid border-neutral-100 text-neutral-600">
      <tbody>
        {tableData.map((row, index) => (
          <TableRow
            key={index}
            label={row.label}
            value={row.value}
            icon={row.icon}
          />
        ))}
        <DeliveryRow
          imageSrc="/icons/delivery.svg"
          deliveryText="Delivery"
          price="$ 2"
        />
      </tbody>
    </table>
  );
};

export default DeliveryTable;
