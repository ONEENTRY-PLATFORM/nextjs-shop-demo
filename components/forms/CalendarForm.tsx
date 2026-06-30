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
import { toLangCode } from '@/app/types/enum';

import CalendarAnimations from './animations/CalendarAnimations';
import TimeSlots from './calendar/TimeSlots';

dayjs.extend(utc);
dayjs.extend(dayOfYear);

/** A single point of a delivery time window. */
type TimePoint = { hours: number; minutes: number };
/** A delivery time window expressed as a [start, end] pair of points. */
type TimeWindow = [TimePoint, TimePoint];
/** A concrete [start, end] pair of dates for a selectable slot. */
type DateRange = [Date, Date];

/**
 * Filter time intervals by a specific date.
 *
 * This function filters an array of time intervals to only include those
 * that overlap with the specified target date.
 * @param   {[string, string][]} intervals  - Array of time intervals as string tuples [start, end].
 * @param   {Date}               targetDate - Date to filter intervals by.
 * @returns {[string, string][]}            Filtered array of intervals that match the target date.
 */
const filterIntervalsByDate = (
  intervals: [string, string][],
  targetDate: Date,
): [string, string][] => {
  if (!intervals) return [];

  /** Create start and end of day in UTC using dayjs */
  const startOfDay = dayjs(targetDate).startOf('day').utc();
  const endOfDay = dayjs(targetDate).endOf('day').utc();

  return intervals.filter(([start, end]) => {
    /** Parse interval start and end as UTC */
    const intervalStart = dayjs(start).utc();
    const intervalEnd = dayjs(end).utc();

    /** Check if the interval overlaps with the target day */
    return intervalStart.isBefore(endOfDay) && intervalEnd.isAfter(startOfDay);
  });
};

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

  /** State for storing current time interval */
  const [currentInterval, setCurrentInterval] = useState<Date[]>([]);

  /** Query for shipping schedule data */
  const { data, error, isLoading } = useGetSingleAttributeByMarkerSetQuery({
    setMarker: 'order',
    attributeMarker: 'shipping_interval',
    activeLang: toLangCode(lang),
  });

  /** Extract time intervals and holidays from API response */
  const schedule = (data?.value as any)?.[0]?.values;

  /** Extract holidays from schedule */
  const holidays = useMemo(() => {
    return schedule
      ?.flatMap((interval: any) => interval.external)
      .filter((h: any) => h && dayjs(h.date).dayOfYear());
  }, [schedule]);

  /**
   * Build the selectable time slots for the currently selected date.
   *
   * The schedule's `times` array defines the recurring daily delivery windows
   * (e.g. 10:00–11:00, 14:00–15:00 …, in UTC). We materialize those windows
   * onto the selected calendar day rather than relying on the server's
   * pre-expanded `timeIntervals`, which only span a fixed ~1-year window and
   * therefore yield no slots once that window has elapsed — the cause of the
   * "calendar opens but no time can be picked" bug. Falls back to the server
   * intervals when a schedule defines no recurring `times`.
   */
  const timeIntervals = useMemo(() => {
    if (!date || Number.isNaN(date.getTime())) {
      return [];
    }

    /**
     * Selected calendar day, used as the UTC wall-clock day for each slot.
     * Slot labels intentionally mirror the schedule's UTC hours (no local-time
     * conversion) — the stored interval is UTC too, so both stay consistent.
     */
    const day = dayjs(date).format('YYYY-MM-DD');
    const pad = (n: number): string => String(n).padStart(2, '0');
    const toSlotDate = (t: TimePoint): Date =>
      dayjs.utc(`${day}T${pad(t.hours)}:${pad(t.minutes)}:00`).toDate();

    /**
     * Recurring daily delivery windows. The schedule may repeat the same windows
     * across several recurrence objects, so de-duplicate by start time.
     */
    const times: TimeWindow[] =
      schedule?.flatMap((interval: any) => interval.times || []) ?? [];

    const seen = new Set<string>();
    const uniqueTimes = times.filter(([start]) => {
      const key = `${start.hours}:${start.minutes}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });

    if (uniqueTimes.length > 0) {
      return uniqueTimes.map(([start, end]) => ({
        interval: [toSlotDate(start), toSlotDate(end)] as DateRange,
        time: `${start.hours}:${pad(start.minutes)}`,
        isDisabled: false,
        isSelected: false,
      }));
    }

    /** Fallback: server pre-expanded intervals filtered to the selected day. */
    const intervals = schedule?.flatMap(
      (interval: any) => interval.timeIntervals,
    );
    return filterIntervalsByDate(intervals, date)?.map((interval: any) => {
      const d = dayjs(interval[0]).toDate();
      return {
        interval: [new Date(interval[0]), new Date(interval[1])] as DateRange,
        time: `${d.getUTCHours()}:${pad(d.getUTCMinutes())}`,
        isDisabled: false,
        isSelected: false,
      };
    });
  }, [schedule, date]);

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
        interval: currentInterval,
      }),
    );
    setTransition('close');
  }, [
    date,
    time,
    deliveryData.address,
    currentInterval,
    dispatch,
    setTransition,
  ]);

  /** Dispatch updated delivery data when date or time changes */
  useEffect(() => {
    dispatch(
      setDeliveryData({
        date: date.getTime(),
        time: time,
        address: deliveryData.address,
        interval: currentInterval,
      }),
    );
  }, [date, time, deliveryData.address, currentInterval, dispatch]);

  /** If loading, return loading indicator */
  if (isLoading) {
    return <div>Loading...</div>;
  }

  /** If error, return error message */
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
        tileDisabled={({ date }) => holidays?.includes(dayjs(date).dayOfYear())}
      />
      {timeIntervals && (
        <TimeSlots
          timeSlots={timeIntervals}
          currentTime={time}
          setTime={setTime}
          setInterval={setCurrentInterval}
        />
      )}
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
