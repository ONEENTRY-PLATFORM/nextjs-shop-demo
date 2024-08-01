import React from 'react';
import MonthSelector from './MonthSelector';
import CalendarGrid from './CalendarGrid';
import TimeSlots from './TimeSlots';

interface CalendarComponentProps {
  selectedMonth: string;
  selectedYear: string;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ selectedMonth, selectedYear }) => {
  return (
    <section className="flex flex-col gap-5 items-center self-stretch p-8 h-auto whitespace-nowrap bg-white rounded-3xl border border-solid border-[black] w-[550px] max-md:flex-wrap max-md:px-5">
      <header className="box-border flex relative flex-row shrink-0 justify-end mb-5 w-full">
        <img loading="lazy" src="" alt="" className="shrink-0 w-10 aspect-square" />
      </header>
      <div className="flex flex-col grow shrink-0 px-20 pb-5 basis-0 w-fit">
        <MonthSelector month={selectedMonth} year={selectedYear} />
        <CalendarGrid />
        <TimeSlots />
        <button className="self-center px-5 py-4 mt-auto max-w-full text-base font-medium text-white uppercase bg-orange-500 rounded-[30px] w-[267px] max-md:px-5 max-md:mt-10">
          Apply
        </button>
      </div>
    </section>
  );
};

export default CalendarComponent;