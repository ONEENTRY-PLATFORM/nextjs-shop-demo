import '@/app/styles/calendar.css';

import type { FC } from 'react';
import React, { useContext, useState } from 'react';
import Calendar from 'react-calendar';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import {
  selectDeliveryData,
  setDeliveryData,
} from '@/app/store/reducers/CartSlice';

import { timeSlotsData } from '../data';
import TimeSlots from './calendar/TimeSlots';

const CalendarForm: FC<{ lang: string }> = ({ lang }) => {
  const dispatch = useAppDispatch();
  const { setOpen } = useContext(OpenDrawerContext);
  const deliveryData = useAppSelector(selectDeliveryData);

  const [date, setDate] = useState<Date>(new Date(deliveryData.date));
  const [time, setTime] = useState<string>(deliveryData.time);

  const onApply = () => {
    dispatch(
      setDeliveryData({
        date: date.getTime(),
        time: time,
        address: deliveryData.address,
      }),
    );
    setOpen(false);
  };

  return (
    <div className="mx-auto max-w-[350px] max-sm:max-w-[300px] ">
      <Calendar
        locale={lang}
        view="month"
        onChange={(value) => {
          setDate(value as Date);
        }}
        value={new Date(date)}
      />
      <TimeSlots
        timeSlots={timeSlotsData}
        currentTime={time}
        setTime={setTime}
      />
      <div className="flex w-full">
        <button
          onClick={onApply}
          type="button"
          className="btn btn-xl btn-primary mx-auto mt-auto w-[270px] max-md:mt-10"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default CalendarForm;
