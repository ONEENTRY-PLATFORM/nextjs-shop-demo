import React from 'react';

import RatingRow from './RatingRow';
import StarRating from './StarRating';

const RatingBlock: React.FC = () => {
  const ratings = [
    { value: 87, barValue: 100, starCount: 5 },
    { value: 95, barValue: 80, starCount: 4 },
    { value: 21, barValue: 60, starCount: 3 },
    { value: 2, barValue: 30, starCount: 2 },
    { value: 0, barValue: 0, starCount: 1 },
  ];

  return (
    <div className="flex max-w-[420px] flex-col px-5">
      <div className="flex items-center gap-2.5 self-start text-3xl font-bold leading-8 text-neutral-600">
        <StarRating rating={4.7} />
        <div>4,7</div>
      </div>
      <div className="mt-6 flex w-full flex-col gap-2">
        {ratings.map((rating, index) => (
          <RatingRow key={index} {...rating} />
        ))}
      </div>
    </div>
  );
};

export default RatingBlock;
