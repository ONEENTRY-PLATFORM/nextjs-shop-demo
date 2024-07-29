import React from "react";

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  return (
    <div className="flex flex-row shrink-0 gap-1.5 items-center">
      {[...Array(5)].map((_, index) => (
        <img
          key={index}
          loading="lazy"
          src="./icons/star.svg"
          alt=""
          className="shrink-0 self-start my-auto aspect-square w-[15px]"
        />
      ))}
    </div>
  );
};

export default StarRating;
