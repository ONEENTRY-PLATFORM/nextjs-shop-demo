import React from 'react';

import CalendarGrid from './calendar/CalendarGrid';
import MonthSelector from './calendar/MonthSelector';
import TimeSlots from './calendar/TimeSlots';

const CalendarComponent: React.FC = () => {
  const selectedYear = 2024;
  const selectedMonth = 'September';

  return (
    <>
      <MonthSelector month={selectedMonth} year={selectedYear} />
      <CalendarGrid />
      <TimeSlots />
      <button
        type="button"
        className="mt-auto w-[267px] max-w-full self-center rounded-[30px] bg-orange-500 px-5 py-4 text-base font-medium uppercase text-white max-md:mt-10 max-md:px-5"
      >
        Apply
      </button>
    </>
  );
};

export default CalendarComponent;
