import type { Dispatch, JSX } from 'react';
import React from 'react';

import TimeSlot from './TimeSlot';

/**
 * Time slots grid.
 * @param props             - Component props.
 * @param props.timeSlots   - Array of time slots. Each time slot is an object with time and isSelected properties.
 * @param props.currentTime - Current time. It is used to highlight the currently selected time slot.
 * @param props.setTime     - Function to set the selected time.
 * @returns                 Time slots grid component.
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
    <div className="mx-auto mb-5 grid max-w-[320px] grid-cols-4 grid-rows-4 gap-2.5 rounded-3xl bg-white text-base font-bold tracking-wide text-orange-500">
      {timeSlots.map((slot, index) => (
        <TimeSlot
          key={index}
          slot={slot}
          currentTime={currentTime}
          setTime={setTime}
        />
      ))}
    </div>
  );
};

export default TimeSlots;
