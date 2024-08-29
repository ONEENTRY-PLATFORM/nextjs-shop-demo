import React from 'react';

interface TimeSlotProps {
  slot: {
    time: string;
    isSelected?: boolean;
    isDisabled?: boolean;
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  setTime: Function;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ slot, setTime }) => {
  let className = 'px-3.5 py-2 rounded-3xl border-2 text-center ';
  const { isSelected, isDisabled, time } = slot;
  if (isSelected) {
    className += 'text-white bg-orange-500 border-orange-500';
  } else if (isDisabled) {
    className += 'border-solid border-slate-300 text-slate-300';
  } else {
    className += 'border-orange-500 border-solid';
  }

  return (
    <button className={className} onClick={setTime(time)}>
      <time>{time}</time>
    </button>
  );
};

export default TimeSlot;
