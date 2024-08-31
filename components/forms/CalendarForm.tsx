import '@/app/styles/calendar.css';

import React, { useContext, useState } from 'react';
import Calendar from 'react-calendar';

import { useAppDispatch } from '@/app/store/hooks';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import { setDeliveryData } from '@/app/store/reducers/CartSlice';

import { timeSlotsData } from '../data';
import TimeSlots from './calendar/TimeSlots';

const CalendarComponent: React.FC = () => {
  const { setOpen } = useContext(OpenDrawerContext);
  const dispatch = useAppDispatch();
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>('');

  const onApply = () => {
    dispatch(setDeliveryData({ date: date.getTime(), time: time }));
    setOpen(false);
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
        className="mt-auto w-full max-w-full self-center rounded-[30px] bg-orange-500 px-5 py-4 text-base font-medium uppercase text-white max-md:mt-10 max-md:px-5"
      >
        Apply
      </button>
    </>
  );
};

export default CalendarComponent;
