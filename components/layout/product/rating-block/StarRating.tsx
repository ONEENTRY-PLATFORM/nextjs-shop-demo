import React from 'react';

interface StarRatingProps {
  count: number;
}

const StarRating: React.FC<StarRatingProps> = ({ count }) => (
  <div className="box-border flex relative flex-row shrink-0 gap-1">
    {[...Array(count)].map((_, index) => (
      <div key={index} className="box-border flex relative flex-col shrink-0 w-5 h-5" />
    ))}
  </div>
);

export default StarRating;