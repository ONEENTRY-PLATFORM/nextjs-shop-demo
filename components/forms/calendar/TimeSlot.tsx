import type { Dispatch, JSX } from 'react';
import React from 'react';

/**
 * Time slot button.
 * @param   {object}                                 props                 - Time slot props.
 * @param   {object}                                 props.slot            - Time slot object. It contains time and isDisabled properties.
 * @param   {string}                                 props.slot.time       - Time value
 * @param   {boolean}                                props.slot.isDisabled - Disabled state
 * @param   {string}                                 props.currentTime     - Current time. It is used to determine which time slot is currently selected.
 * @param   {Dispatch<React.SetStateAction<string>>} props.setTime         - Set time. It is used to update the selected time.
 * @returns {JSX.Element}                                                  Time slot button.
 */
const TimeSlot = ({
  slot,
  currentTime,
  setTime,
}: {
  slot: {
    time: string;
    isDisabled?: boolean;
  };
  currentTime: string;
  setTime: Dispatch<React.SetStateAction<string>>;
}): JSX.Element => {
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
