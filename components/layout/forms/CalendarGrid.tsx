import React from "react";

const CalendarGrid: React.FC = () => {
  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const calendarDays = [
    ["28", "29", "30", "01", "02", "03", "04"],
    ["05", "06", "07", "08", "09", "10", "11"],
    ["12", "13", "14", "15", "16", "17", "18"],
    ["19", "20", "21", "22", "23", "24", "25"],
    ["26", "27", "28", "29", "30", "31", "01"],
  ];

  return (
    <div className="flex flex-col gap-4 mb-8 text-base font-light text-neutral-700">
      <div className="flex gap-1.5 justify-between font-medium text-orange-500">
        {weekDays.map((day, index) => (
          <div key={index} className="leading-8 text-center h-[30px] w-[30px]">
            {day}
          </div>
        ))}
      </div>
      {calendarDays.map((week, weekIndex) => (
        <div
          key={weekIndex}
          className="flex gap-1.5 justify-between text-center"
        >
          {week.map((day, dayIndex) => {
            let className = "leading-8 h-[30px] w-[30px]";
            if (weekIndex === 0 || (weekIndex === 4 && dayIndex === 6)) {
              className += " text-neutral-400";
            }
            if (day === "14" && weekIndex === 2) {
              className +=
                " py-1 font-medium text-white bg-orange-500 rounded-md";
            }
            return (
              <div key={dayIndex} className={className}>
                {day}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CalendarGrid;
