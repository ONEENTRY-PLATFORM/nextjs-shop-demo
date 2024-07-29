import React from "react";
import ReviewSymbol from "./ReviewSymbol";

const ReviewList: React.FC = () => {
  const reviewCount = 4;

  return (
    <section className="flex flex-col gap-5 max-md:mt-10 max-md:max-w-full">
      {Array.from({ length: reviewCount }).map((_, index) => (
        <ReviewSymbol key={index} />
      ))}
    </section>
  );
};

export default ReviewList;
