import React from 'react';

import RatingBar from './RatingBar';
import StarRating from './StarRating';

interface RatingRowProps {
  value: number;
  barValue: number;
  starCount: number;
}

const RatingRow: React.FC<RatingRowProps> = ({
  value,
  barValue,
  starCount,
}) => (
  <div className="flex w-full justify-start gap-2.5">
    <div className="w-[30px] text-lg leading-5 text-neutral-600">{value}</div>
    <RatingBar value={barValue} maxWidth="200px" />
    <StarRating rating={starCount} />
  </div>
);

export default RatingRow;
