import React from "react";
import StarRating from "./StarRating";

interface ReviewSectionProps {
  rating: number;
  reviewCount: number;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  rating,
  reviewCount,
}) => {
  return (
    <section className="flex gap-5 mr-auto">
      <div className="flex gap-2.5">
        <StarRating rating={rating} />
        <div className="text-lg font-bold text-neutral-600">
          {rating.toFixed(1)}
        </div>
        <div className="text-sm leading-5 text-slate-300">{reviewCount}</div>
      </div>
      <div className="flex gap-3.5 items-center my-auto text-lg uppercase whitespace-nowrap text-neutral-600">
        <h2>Reviews</h2>
        <img
          loading="lazy"
          src=""
          alt=""
          className="shrink-0 self-start my-auto aspect-[1.92] w-[25px]"
        />
      </div>
    </section>
  );
};

const ReviewsGroup: React.FC = () => {
  return <ReviewSection rating={4.7} reviewCount={7979} />;
};

export default ReviewsGroup;
