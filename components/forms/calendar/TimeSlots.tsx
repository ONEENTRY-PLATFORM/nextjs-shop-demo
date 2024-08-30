import React from 'react';

import TimeSlot from './TimeSlot';

interface TimeSlotsProps {
  timeSlots: Array<{
    time: string;
    isSelected?: boolean | undefined;
    isDisabled?: boolean | undefined;
  }>;
  currentTime: string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  setTime: Function;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const TimeSlots: React.FC<TimeSlotsProps> = ({
  timeSlots,
  currentTime,
  setTime,
}) => {
  return (
    <div className="mb-5 grid grid-cols-4 grid-rows-4 gap-2.5 rounded-3xl bg-white px-8 text-base font-bold tracking-wide text-orange-500">
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
