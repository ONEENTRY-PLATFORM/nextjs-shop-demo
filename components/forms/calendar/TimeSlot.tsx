import React from 'react';

interface TimeSlotProps {
  time: string;
  isSelected?: boolean;
  isDisabled?: boolean;
}

const TimeSlot: React.FC<TimeSlotProps> = ({
  time,
  isSelected,
  isDisabled,
}) => {
  let className = 'px-3.5 py-2 rounded-3xl border-2 ';
  if (isSelected) {
    className += 'text-white bg-orange-500 border-orange-500';
  } else if (isDisabled) {
    className += 'border-solid border-slate-300 text-slate-300';
  } else {
    className += 'border-orange-500 border-solid';
  }

  return <time className={className}>{time}</time>;
};

export default TimeSlot;
