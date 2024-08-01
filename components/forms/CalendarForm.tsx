import React from "react";
import MonthSelector from "./calendar/MonthSelector";
import CalendarGrid from "./calendar/CalendarGrid";
import TimeSlots from "./calendar/TimeSlots";

const CalendarComponent: React.FC = () => {
  const selectedYear = 2024;
  const selectedMonth = 10;

  return (
    <>
      <MonthSelector month={selectedMonth} year={selectedYear} />
      <CalendarGrid />
      <TimeSlots />
      <button className="self-center px-5 py-4 mt-auto max-w-full text-base font-medium text-white uppercase bg-orange-500 rounded-[30px] w-[267px] max-md:px-5 max-md:mt-10">
        Apply
      </button>
    </>
  );
};

export default CalendarComponent;
