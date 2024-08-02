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
  let className = 'px-3.5 py-2 rounded-3xl border-2 text-center ';
  if (isSelected) {
    className += 'text-white bg-orange-500 border-orange-500';
  } else if (isDisabled) {
    className += 'border-solid border-slate-300 text-slate-300';
  } else {
    className += 'border-orange-500 border-solid';
  }

  return (
    <button className={className}>
      <time>{time}</time>
    </button>
  );
};

export default TimeSlot;
