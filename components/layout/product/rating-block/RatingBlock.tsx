import type { FC } from 'react';

import { ratingsData } from '@/components/data';

import RatingRow from './RatingRow';
import StarRating from './StarRating';

interface RatingBlockProps {
  rating: number;
  reviewCount: number;
}

const RatingBlock: FC<RatingBlockProps> = (rating) => {
  return (
    <div className="flex max-w-[420px] flex-col px-5 max-md:max-w-full">
      <div className="flex items-center gap-2.5 self-start text-3xl font-bold leading-8 text-neutral-600">
        <StarRating rating={rating.rating} />
        <div>{rating.rating}</div>
      </div>
      <div className="mt-6 flex w-full flex-col gap-2">
        {ratingsData.map((rating, index) => (
          <RatingRow key={index} {...rating} />
        ))}
      </div>
    </div>
  );
};

export default RatingBlock;
