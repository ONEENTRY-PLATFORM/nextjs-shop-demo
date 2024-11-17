import type { FC } from 'react';

import { ratingsData } from '@/components/data';

import ReviewAnimations from '../animations/ReviewAnimations';
import RatingRow from './RatingRow';
import StarRating from './StarRating';

interface RatingBlockProps {
  productRating: {
    rating: number;
    reviewCount: number;
  };
  state: boolean;
}

/**
 * RatingBlock
 * @param productRating
 * @param state
 *
 * @returns RatingBlock
 */
const RatingBlock: FC<RatingBlockProps> = ({ productRating, state }) => {
  return (
    <ReviewAnimations
      className="flex max-w-[420px] flex-col px-5 max-md:max-w-full"
      index={4}
      state={state}
    >
      <div className="flex items-center gap-2.5 self-start text-3xl font-bold leading-8 text-neutral-600">
        <StarRating rating={productRating.rating} />
        <div>{productRating.rating}</div>
      </div>
      <div className="mt-6 flex w-full flex-col gap-2">
        {ratingsData.map((rating, index) => (
          <RatingRow key={index} rating={rating} state={state} />
        ))}
      </div>
    </ReviewAnimations>
  );
};

export default RatingBlock;
