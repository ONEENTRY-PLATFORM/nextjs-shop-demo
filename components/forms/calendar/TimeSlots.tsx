import React from 'react';

import TimeSlot from './TimeSlot';

const TimeSlots: React.FC = () => {
  const times = [
    {
      time: '10:00',
    },
    {
      time: '11:00',
      isDisabled: true,
    },
    {
      time: '12:00',
    },
    {
      time: '13:00',
    },
    {
      time: '14:00',
    },
    {
      time: '15:00',
    },
    {
      time: '16:00',
    },
    {
      time: '17:00',
      isDisabled: true,
    },
    {
      time: '18:00',
      isDisabled: true,
    },
    {
      time: '19:00',
      isSelected: true,
    },
    {
      time: '20:00',
    },
    {
      time: '20:00',
    },
  ];

  return (
    <div className="mb-5 grid grid-cols-4 grid-rows-4 gap-2.5 rounded-3xl bg-white px-8 text-base font-bold tracking-wide text-orange-500">
      {times.map((slot, index) => (
        <TimeSlot key={index} {...slot} />
      ))}
    </div>
  );
};

export default TimeSlots;
