'use client';

import '@/app/styles/calendar.css';

import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import utc from 'dayjs/plugin/utc';
import {
  expandAttributeTimeIntervals,
  isTimeIntervalAttribute,
} from 'oneentry';
import type { IAttributeValue, IAttributeValues } from 'oneentry/types';
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
 * Holiday entry attached to a schedule group by the admin panel.
 * Not part of the SDK's `ITimeIntervalEntitySchedule` — kept as a local
 * extension for backward compatibility with older API responses.
 * @property {string} date - ISO date of the holiday.
 */
type HolidayEntry = { date: string };

/**
 * Calendar form component for selecting delivery date and time.
 * @param   {object}           props      - Component props.
 * @param   {string}           props.lang - Current language shortcode.
 * @param   {IAttributeValues} props.dict - Dictionary from server API (passed by the modal host).
 * @returns {JSX.Element}                 Calendar form.
 */
const CalendarForm = ({
  lang,
  dict,
}: {
  lang: string;
  dict: IAttributeValues;
}): JSX.Element => {
  /** Redux dispatch function for updating store */
  const dispatch = useAppDispatch();

  /** Context for controlling drawer transition animations */
  const { setTransition } = useContext(OpenDrawerContext);

  /** Delivery data from Redux store including current date and time selection */
  const deliveryData = useAppSelector(selectDeliveryData);

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

  /**
   * The `shipping_interval` attribute normalized to the SDK attribute-value
   * shape, so the SDK narrowing guard and interval resolver can consume it.
   */
  const scheduleAttr = useMemo<IAttributeValue | undefined>(
    () => (data ? { type: data.type, value: data.value ?? null } : undefined),
    [data],
  );

  /** Extract the schedule entries (recurrence rules) from the API response */
  const schedule = useMemo(() => {
    if (!isTimeIntervalAttribute(scheduleAttr)) {
      return undefined;
    }
    return scheduleAttr.value[0]?.values;
  }, [scheduleAttr]);

  /** Extract holidays from schedule as day-of-year numbers */
  const holidays = useMemo(() => {
    return schedule
      ?.flatMap(
        (interval) =>
          (interval as { external?: HolidayEntry[] }).external ?? [],
      )
      .filter((h) => h && dayjs(h.date).dayOfYear())
      .map((h) => dayjs(h.date).dayOfYear());
  }, [schedule]);

  /**
   * Build the selectable time slots for the currently selected date.
   *
   * The schedule's `times` array defines the recurring daily delivery windows
   * (e.g. 10:00–11:00, 14:00–15:00 …, in UTC). We materialize those windows
   * onto the selected calendar day rather than relying on the server's
   * pre-expanded `timeIntervals`, which only span a fixed ~1-year window and
   * therefore yield no slots once that window has elapsed — the cause of the
   * "calendar opens but no time can be picked" bug. Falls back to the SDK's
   * `expandAttributeTimeIntervals` resolver when a schedule defines no
   * recurring `times`.
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
      schedule?.flatMap(
        (interval) => (interval.times as TimeWindow[] | undefined) ?? [],
      ) ?? [];

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

    /**
     * Fallback: no recurring `times` in the schedule — resolve concrete slots
     * for the selected day with the SDK's `expandAttributeTimeIntervals`
     * (the server-side pre-expanded `timeIntervals` field was removed in
     * SDK 1.0.156 and no longer exists on the response).
     */
    return expandAttributeTimeIntervals(scheduleAttr, {
      from: day,
      to: day,
    }).map(([start, end]) => {
      const d = dayjs(start).toDate();
      return {
        interval: [new Date(start), new Date(end)] as DateRange,
        time: `${d.getUTCHours()}:${pad(d.getUTCMinutes())}`,
        isDisabled: false,
        isSelected: false,
      };
    });
  }, [schedule, scheduleAttr, date]);

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
   * @param {unknown} value - Value emitted by react-calendar (a single Date in month view)
   */
  const handleDateChange = useCallback((value: unknown) => {
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
    return <div>{(dict?.loading_text?.value as string) || 'Loading...'}</div>;
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
        tileDisabled={({ date }) =>
          holidays?.includes(dayjs(date).dayOfYear()) ?? false
        }
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
