/* eslint-disable jsdoc/no-undefined-types */
import type { Dispatch, JSX } from 'react';

import TimeSlot from './TimeSlot';

export type TimeSlotData = {
  time: string;
  interval: [Date, Date];
  isSelected?: boolean | undefined;
  isDisabled?: boolean;
};

/**
 * Time slots grid component for displaying available time slots in a grid layout.
 * Renders a grid of TimeSlot components based on the provided time slots data.
 * @param   {object}                                 props             - Component props.
 * @param   {Array<TimeSlotData>}                    props.timeSlots   - Array of time slots. Each time slot is an object with time and isSelected properties.
 * @param   {string}                                 props.currentTime - Current time. It is used to highlight the currently selected time slot.
 * @param   {Dispatch<React.SetStateAction<string>>} props.setTime     - Function to set the selected time.
 * @param   {Dispatch<React.SetStateAction<Date[]>>} props.setInterval - Function to set the selected interval.
 * @returns {JSX.Element}                                              Time slots grid component.
 */
const TimeSlots = ({
  timeSlots,
  currentTime,
  setTime,
  setInterval,
}: {
  timeSlots: Array<TimeSlotData>;
  currentTime: string;
  setTime: Dispatch<React.SetStateAction<string>>;
  setInterval: Dispatch<React.SetStateAction<Date[]>>;
}): JSX.Element => {
  /**
   * Handle time slot selection
   * Updates both the time and interval when a slot is clicked
   * @param   {string}       time     - The selected time
   * @param   {[Date, Date]} interval - The selected time interval
   * @returns {void}                  - No return value
   */
  const handleTimeSelect = (time: string, interval: [Date, Date]): void => {
    setTime(time);
    setInterval(interval.map((dateStr) => new Date(dateStr)));
  };

  return (
    /** Container for time slots grid */
    <div className="mx-auto mb-5 grid max-w-[320px] grid-cols-4 gap-2.5 rounded-3xl bg-white text-base font-bold tracking-wide text-orange-500">
      {/*
       * Map through time slots and render TimeSlot component for each
       * Passes down slot data, current time, and handler for time/interval selection
       */
      timeSlots?.map((slot) => (
        <TimeSlot
          key={slot.time}
          slot={slot}
          currentTime={currentTime}
          onSelect={() => handleTimeSelect(slot.time, slot.interval)}
        />
      ))}
    </div>
  );
};

export default TimeSlots;
