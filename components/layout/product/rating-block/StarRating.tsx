import React from 'react';

interface StarRatingProps {
  count: number;
}

const StarRating: React.FC<StarRatingProps> = ({ count }) => (
  <div className="relative box-border flex shrink-0 flex-row gap-1">
    {[...Array(count)].map((_, index) => (
      <div
        key={index}
        className="relative box-border flex size-5 shrink-0 flex-col"
      />
    ))}
  </div>
);

export default StarRating;
