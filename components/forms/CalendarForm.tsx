/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import '@/app/styles/calendar.css';

import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import utc from 'dayjs/plugin/utc';
import type { JSX } from 'react';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Calendar from 'react-calendar';

import { useGetSingleAttributeByMarkerSetQuery } from '@/app/api/api/RTKApi';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import {
  selectDeliveryData,
  setDeliveryData,
} from '@/app/store/reducers/CartSlice';

import CalendarAnimations from './animations/CalendarAnimations';
import TimeSlots from './calendar/TimeSlots';

dayjs.extend(utc);
dayjs.extend(dayOfYear);

/**
 * Calendar form component for selecting delivery date and time.
 * @param   {object}      props      - Component props.
 * @param   {string}      props.lang - Current language shortcode.
 * @returns {JSX.Element}            Calendar form.
 */
const CalendarForm = ({ lang }: { lang: string }): JSX.Element => {
  /** Redux dispatch function for updating store */
  const dispatch = useAppDispatch();

  /** Context for controlling drawer transition animations */
  const { setTransition } = useContext(OpenDrawerContext);

  /** Delivery data from Redux store including current date and time selection */
  const deliveryData: any = useAppSelector(selectDeliveryData);

  /** State for storing selected delivery date */
  const [date, setDate] = useState<Date>(new Date(deliveryData?.date));

  /** State for storing selected delivery time */
  const [time, setTime] = useState<string>(deliveryData?.time);

  /** Query for shipping schedule data */
  const { data, error, isLoading } = useGetSingleAttributeByMarkerSetQuery({
    setMarker: 'order',
    attributeMarker: 'shipping_interval',
    activeLang: lang,
  });

  /** Generate and format time intervals (memoized) */
  const timeIntervals = useMemo(() => {
    const schedule = data?.value?.[0]?.values?.[0]?.times;
    return schedule
      ?.map((time: any) => {
        return {
          time: `${time[0].hours}:${time[0].minutes < 10 ? `0${time[0].minutes}` : time[0].minutes}`,
        };
      })
      ?.map((data: any) => {
        return {
          time: data.time,
          isDisabled: false,
          isSelected: false,
        };
      });
  }, [data]);

  /**
   * Get today's date at midnight (memoized)
   * This is used as the minimum selectable date
   */
  const minDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, []);

  /**
   * Handler function for date change
   */
  const handleDateChange = useCallback((value: any) => {
    setDate(value as Date);
  }, []);

  /**
   * Handler function for applying selected date and time
   * Updates the delivery data in Redux store and closes the drawer
   */
  const onApplyHandle = useCallback(() => {
    dispatch(
      setDeliveryData({
        date: date.getTime(),
        time: time,
        address: deliveryData.address,
      }),
    );
    setTransition('close');
  }, [date, time, deliveryData.address, dispatch, setTransition]);

  /** Dispatch updated delivery data when date or time changes */
  useEffect(() => {
    dispatch(
      setDeliveryData({
        date: date.getTime(),
        time: time,
        address: deliveryData.address,
      }),
    );
  }, [date, time, dispatch, deliveryData.address]);

  /** If loading, return loading indicator */
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <CalendarAnimations className="mx-auto max-w-87.5 max-sm:max-w-75">
      <Calendar
        locale={lang}
        view="month"
        onChange={handleDateChange}
        value={new Date(date)}
        minDate={minDate}
      />
      <TimeSlots
        timeSlots={timeIntervals}
        currentTime={time}
        setTime={setTime}
      />
      <div className="flex w-full">
        <button
          onClick={onApplyHandle}
          type="button"
          className="btn btn-xl btn-primary mx-auto mt-auto w-67.5 max-md:mt-10"
        >
          {/** !!! */}
          Apply
        </button>
      </div>
    </CalendarAnimations>
  );
};

export default CalendarForm;
