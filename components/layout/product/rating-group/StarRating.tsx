import Image from 'next/image';
import React from 'react';

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  return (
    <div className="flex shrink-0 flex-row items-center gap-1.5">
      {[...Array(5)].map((_, index) => (
        <Image
          key={index}
          loading="lazy"
          src="./icons/star.svg"
          alt=""
          className="my-auto aspect-square w-[15px] shrink-0 self-start"
        />
      ))}
    </div>
  );
};

export default StarRating;
