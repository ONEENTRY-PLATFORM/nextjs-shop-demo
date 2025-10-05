'use client';

import '@/app/styles/calendar.css';

import type { JSX } from 'react';
import React, { useContext, useState } from 'react';
import Calendar from 'react-calendar';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import {
  selectDeliveryData,
  setDeliveryData,
} from '@/app/store/reducers/CartSlice';

import { timeSlotsData } from '../data';
import CalendarAnimations from './animations/CalendarAnimations';
import TimeSlots from './calendar/TimeSlots';

/**
 * Calendar form.
 * @param   {object}      props      - Component props.
 * @param   {string}      props.lang - Current language shortcode.
 * @returns {JSX.Element}            Calendar form.
 */
const CalendarForm = ({ lang }: { lang: string }): JSX.Element => {
  const dispatch = useAppDispatch();
  const { setTransition } = useContext(OpenDrawerContext);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deliveryData: any = useAppSelector(selectDeliveryData);

  const [date, setDate] = useState<Date>(new Date(deliveryData?.date));
  const [time, setTime] = useState<string>(deliveryData?.time);

  // Apply date to CartSlice
  const onApplyHandle = () => {
    dispatch(
      setDeliveryData({
        date: date.getTime(),
        time: time,
        address: deliveryData.address,
      }),
    );
    setTransition('close');
  };

  return (
    <CalendarAnimations className="mx-auto max-w-[350px] max-sm:max-w-[300px]">
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
          onClick={onApplyHandle}
          type="button"
          className="btn btn-xl btn-primary mx-auto mt-auto w-[270px] max-md:mt-10"
        >
          {/* !!! */}
          Apply
        </button>
      </div>
    </CalendarAnimations>
  );
};

export default CalendarForm;
