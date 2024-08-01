import React from "react";

interface MonthSelectorProps {
  month: string;
  year: string;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ month, year }) => {
  return (
    <div className="flex gap-5 justify-between items-center py-1.5 mb-5 w-full text-2xl">
      <img
        loading="lazy"
        src=""
        alt=""
        className="shrink-0 self-stretch my-auto w-1.5 border-none aspect-[0.5] border-[3px] border-slate-300 stroke-[2.579px] stroke-slate-300"
      />
      <div className="flex gap-5 justify-center self-stretch text-xl bg-white">
        <div className="font-medium text-orange-500">{month}</div>
        <div className="font-light text-orange-500">{year}</div>
      </div>
      <img
        loading="lazy"
        src=""
        alt=""
        className="shrink-0 self-stretch my-auto w-1.5 border-none aspect-[0.5] border-[3px] border-slate-300 stroke-[2.579px] stroke-slate-300"
      />
    </div>
  );
};

export default MonthSelector;
