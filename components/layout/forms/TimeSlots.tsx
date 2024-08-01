import React from "react";

interface TimeSlotProps {
  time: string;
  isDisabled?: boolean;
  isSelected?: boolean;
}

const TimeSlot: React.FC<TimeSlotProps> = ({
  time,
  isDisabled = false,
  isSelected = false,
}) => {
  let className = "px-3.5 py-2 rounded-3xl border-2 border-solid ";
  if (isDisabled) {
    className += "border-slate-300 text-slate-300";
  } else if (isSelected) {
    className += "text-white bg-orange-500 border-orange-500";
  } else {
    className += "border-orange-500";
  }

  return <time className={className}>{time}</time>;
};

const TimeSlots: React.FC = () => {
  const times = [
    { time: "10:00" },
    { time: "11:00", isDisabled: true },
    { time: "12:00" },
    { time: "13:00" },
    { time: "14:00" },
    { time: "15:00" },
    { time: "16:00" },
    { time: "17:00", isDisabled: true },
    { time: "18:00", isDisabled: true },
    { time: "19:00", isSelected: true },
    { time: "20:00" },
    { time: "20:00" },
  ];

  return (
    <div className="flex flex-row flex-wrap gap-2.5 justify-between mb-5 text-base font-bold tracking-wide text-orange-500 bg-white rounded-3xl max-md:pl-5">
      {times.map((slot, index) => (
        <TimeSlot key={index} {...slot} />
      ))}
    </div>
  );
};

export default TimeSlots;
