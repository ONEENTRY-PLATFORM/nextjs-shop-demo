import Image from 'next/image';
import React from 'react';

import StarRating from './StarRating';

interface ReviewSectionProps {
  rating: number;
  reviewCount: number;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  rating,
  reviewCount,
}) => {
  return (
    <section className="mr-auto flex gap-5">
      <div className="flex gap-2.5">
        <StarRating rating={rating} />
        <div className="text-lg font-bold text-neutral-600">
          {rating.toFixed(1)}
        </div>
        <div className="text-sm leading-5 text-slate-300">{reviewCount}</div>
      </div>
      <div className="my-auto flex items-center gap-3.5 whitespace-nowrap text-lg uppercase text-neutral-600">
        <h2>Reviews</h2>
        <Image
          loading="lazy"
          src=""
          alt=""
          className="my-auto aspect-[1.92] w-[25px] shrink-0 self-start"
        />
      </div>
    </section>
  );
};

const ReviewsGroup: React.FC = () => {
  return <ReviewSection rating={4.7} reviewCount={7979} />;
};

export default ReviewsGroup;
