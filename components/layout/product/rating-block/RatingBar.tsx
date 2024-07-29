import React from 'react';

interface RatingBarProps {
  value: number;
  maxWidth: string;
}

const RatingBar: React.FC<RatingBarProps> = ({ value, maxWidth }) => (
  <div className="flex flex-col justify-center my-auto" style={{ width: maxWidth }}>
    <div className="flex flex-col justify-center rounded-md bg-neutral-100">
      <div
        className="shrink-0 h-2 bg-yellow-500 rounded-md"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default RatingBar;