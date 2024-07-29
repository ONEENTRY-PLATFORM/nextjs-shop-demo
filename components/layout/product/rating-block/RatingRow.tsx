import React from 'react';
import RatingBar from './RatingBar';
import StarRating from './StarRating';

interface RatingRowProps {
  value: number;
  barValue: number;
  starCount: number;
}

const RatingRow: React.FC<RatingRowProps> = ({ value, barValue, starCount }) => (
  <div className="flex gap-2.5 justify-start w-full">
    <div className="text-lg leading-5 text-neutral-600 w-[30px]">{value}</div>
    <RatingBar value={barValue} maxWidth="200px" />
    <StarRating count={starCount} />
  </div>
);

export default RatingRow;