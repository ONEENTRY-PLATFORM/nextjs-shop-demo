'use client';

import React from 'react';

import StarRating from './StarRating';

interface ReviewSectionProps {
  rating: number;
  reviewCount: number;
  state: boolean;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  setState: Function;
}

const RatingButton: React.FC<ReviewSectionProps> = ({
  state,
  setState,
  rating,
  reviewCount,
}) => {
  return (
    <button
      onClick={() => setState(!state)}
      className="mb-6 mr-auto flex gap-5"
    >
      <div className="flex gap-2.5">
        <StarRating rating={rating} />
        <div className="text-lg font-bold text-neutral-600">
          {rating.toFixed(1)}
        </div>
        <div className="text-sm leading-5 text-slate-300">{reviewCount}</div>
      </div>

      <div className="my-auto flex items-center gap-3.5 whitespace-nowrap text-lg uppercase text-neutral-600">
        <div>Reviews</div>
        <svg
          width="26"
          height="14"
          viewBox="0 0 26 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className=""
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.939123 13.6835C0.561619 13.2804 0.58239 12.6476 0.985514 12.2701L13.4156 0.629985L25.8457 12.2701L24.4786 13.7299L13.4156 3.37L2.35258 13.7299C1.94945 14.1074 1.31663 14.0866 0.939123 13.6835Z"
            fill="#4C4D56"
          />
        </svg>
      </div>
    </button>
  );
};

export default RatingButton;
