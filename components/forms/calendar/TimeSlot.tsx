import React from 'react';

interface TimeSlotProps {
  slot: {
    time: string;
    isDisabled?: boolean;
  };
  currentTime: string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  setTime: Function;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ slot, currentTime, setTime }) => {
  let className = 'px-3.5 py-2 rounded-3xl border-2 text-center ';
  const { isDisabled, time } = slot;
  if (currentTime === time) {
    className += 'text-white bg-orange-500 border-orange-500';
  } else if (isDisabled) {
    className += 'border-solid border-slate-300 text-slate-300';
  } else {
    className += 'border-orange-500 border-solid';
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
