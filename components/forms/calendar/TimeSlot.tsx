import type { Dispatch } from 'react';
import React from 'react';

interface TimeSlotProps {
  slot: {
    time: string;
    isDisabled?: boolean;
  };
  currentTime: string;
  setTime: Dispatch<React.SetStateAction<string>>;
}

/**
 * Time slot button
 * @param slot time slot object
 * @param currentTime
 * @param setTime
 *
 * @returns Time slot button
 */
const TimeSlot: React.FC<TimeSlotProps> = ({ slot, currentTime, setTime }) => {
  let className = 'px-2 py-1.5 rounded-3xl border-2 text-center text-sm ';
  const { isDisabled, time } = slot;
  if (currentTime === time) {
    className += 'text-white bg-orange-500 border-orange-500';
  } else if (isDisabled) {
    className += 'border-solid border-slate-300 text-slate-300';
  } else {
    className +=
      'border-orange-500 border-solid hover:border-red-500 hover:text-red-500';
  }

  return (
    <button
      className={className}
      onClick={() => setTime(time)}
      disabled={isDisabled}
    >
      <time>{time}</time>
    </button>
  );
};

export default TimeSlot;
