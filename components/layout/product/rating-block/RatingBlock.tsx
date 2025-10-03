import type { FC } from 'react';

import { ratingsData } from '@/components/data';

import ReviewAnimations from '../animations/ReviewAnimations';
import RatingRow from './RatingRow';
import StarRating from './StarRating';

/**
 * Rating block props
 *
 * @property productRating - product rating data
 * @property productRating.rating - rating value
 * @property productRating.reviewCount - number of reviews
 * @property state - animation state
 */
interface RatingBlockProps {
  productRating: {
    rating: number;
    reviewCount: number;
  };
  state: boolean;
}

/**
 * RatingBlock
 *
 * @param props - Rating block props
 * @param props.productRating - product rating data
 * @param props.state - animation state
 *
 * @returns RatingBlock component
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
