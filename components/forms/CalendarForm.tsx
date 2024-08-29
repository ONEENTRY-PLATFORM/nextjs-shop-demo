import React, { useState } from 'react';
import Calendar from 'react-calendar';

import TimeSlots from './calendar/TimeSlots';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const timeSlots = [
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

const CalendarComponent: React.FC = () => {
  const [date, setDate] = useState<Value>(new Date());
  const [time, setTime] = useState<string>('');

  const onApply = () => {
    console.log(date);
    console.log(time);
  };

  return (
    <>
      <Calendar view="month" onChange={setDate} value={date} />
      <TimeSlots timeSlots={timeSlots} setTime={setTime} />
      <button
        onClick={onApply}
        type="button"
        className="mt-auto w-[267px] max-w-full self-center rounded-[30px] bg-orange-500 px-5 py-4 text-base font-medium uppercase text-white max-md:mt-10 max-md:px-5"
      >
        Apply
      </button>
    </>
  );
};

export default CalendarComponent;
