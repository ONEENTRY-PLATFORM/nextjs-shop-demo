/* eslint-disable jsdoc/no-undefined-types */
import type { Dispatch, JSX } from 'react';

import TimeSlot from './TimeSlot';

/**
 * Time slots grid component for displaying available time slots in a grid layout.
 * Renders a grid of TimeSlot components based on the provided time slots data.
 * @param   {object}                                 props             - Component props.
 * @param   {Array<object>}                          props.timeSlots   - Array of time slots. Each time slot is an object with time and isSelected properties.
 * @param   {string}                                 props.currentTime - Current time. It is used to highlight the currently selected time slot.
 * @param   {Dispatch<React.SetStateAction<string>>} props.setTime     - Function to set the selected time.
 * @returns {JSX.Element}                                              Time slots grid component.
 */
const TimeSlots = ({
  timeSlots,
  currentTime,
  setTime,
}: {
  timeSlots: Array<{
    time: string;
    isSelected?: boolean | undefined;
    isDisabled?: boolean;
  }>;
  currentTime: string;
  setTime: Dispatch<React.SetStateAction<string>>;
}): JSX.Element => {
  return (
    /**
     * Container for time slots grid
     * Uses CSS Grid to arrange time slots in a 4x4 layout with specific styling
     */
    <div className="mx-auto mb-5 grid max-w-[320px] grid-cols-4 gap-2.5 rounded-3xl bg-white text-base font-bold tracking-wide text-orange-500">
      {/*
       * Map through time slots and render TimeSlot component for each
       * Passes down slot data, current time, and setTime function to each TimeSlot
       */
      timeSlots?.map((slot) => (
        <TimeSlot
          key={slot.time}
          slot={slot}
          currentTime={currentTime}
          setTime={setTime}
        />
      ))}
    </div>
  );
};

export default TimeSlots;
