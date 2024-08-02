import React from 'react';

const CalendarGrid: React.FC = () => {
  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const calendarDays = [
    ['28', '29', '30', '01', '02', '03', '04'],
    ['05', '06', '07', '08', '09', '10', '11'],
    ['12', '13', '14', '15', '16', '17', '18'],
    ['19', '20', '21', '22', '23', '24', '25'],
    ['26', '27', '28', '29', '30', '31', '01'],
  ];

  return (
    <div className="mb-8 flex flex-col gap-4 text-base font-light text-neutral-700">
      <div className="flex justify-between gap-1.5 font-medium text-orange-500">
        {weekDays.map((day, index) => (
          <div key={index} className="size-[30px] text-center leading-8">
            {day}
          </div>
        ))}
      </div>
      {calendarDays.map((week, weekIndex) => (
        <div
          key={weekIndex}
          className="flex justify-between gap-1.5 text-center"
        >
          {week.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className={`size-[30px] leading-8 ${
                day === '14'
                  ? 'rounded-md bg-orange-500 font-medium text-white'
                  : weekIndex === 0 || weekIndex === 4
                    ? 'text-neutral-400'
                    : ''
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CalendarGrid;
