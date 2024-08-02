import React from 'react';

interface MonthSelectorProps {
  month: string;
  year: number;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ month, year }) => {
  return (
    <div className="mx-auto mb-5 flex w-full items-center justify-between gap-5 py-1.5 text-2xl">
      <button className="my-auto w-1.5 shrink-0 self-stretch">
        <svg
          width="7"
          height="12"
          viewBox="0 0 7 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.70711 0.292893C7.09763 0.683418 7.09763 1.31658 6.70711 1.70711L2.41421 6L6.70711 10.2929C7.09763 10.6834 7.09763 11.3166 6.70711 11.7071C6.31658 12.0976 5.68342 12.0976 5.29289 11.7071L0.292893 6.70711C-0.0976313 6.31658 -0.0976312 5.68342 0.292893 5.29289L5.29289 0.292893C5.68342 -0.0976312 6.31658 -0.0976311 6.70711 0.292893Z"
            fill="#B0BCCE"
          />
        </svg>
      </button>

      <div className="flex justify-center gap-5 self-stretch bg-white text-xl text-orange-500">
        <div className="font-medium">{month}</div>
        <div className="font-light">{year}</div>
      </div>

      <button className="my-auto w-1.5 shrink-0 self-stretch">
        <svg
          width="7"
          height="12"
          viewBox="0 0 7 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0.292893 11.7071C-0.0976311 11.3166 -0.0976311 10.6834 0.292893 10.2929L4.58579 6L0.292893 1.70711C-0.097631 1.31658 -0.097631 0.683417 0.292893 0.292893C0.683418 -0.0976314 1.31658 -0.0976314 1.70711 0.292893L6.70711 5.29289C7.09763 5.68342 7.09763 6.31658 6.70711 6.70711L1.70711 11.7071C1.31658 12.0976 0.683417 12.0976 0.292893 11.7071Z"
            fill="#B0BCCE"
          />
        </svg>
      </button>
    </div>
  );
};

export default MonthSelector;
