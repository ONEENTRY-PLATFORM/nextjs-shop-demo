import React, { useState } from 'react';
import Calendar from 'react-calendar';

import { timeSlotsData } from '../data';
import TimeSlots from './calendar/TimeSlots';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

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
      <TimeSlots
        timeSlots={timeSlotsData}
        currentTime={time}
        setTime={setTime}
      />
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
