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
    <table className="table max-w-[725px] text-neutral-600">
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
        deliveryPrice="$ 2"
      />
    </table>
  );
};

export default DeliveryTable;
