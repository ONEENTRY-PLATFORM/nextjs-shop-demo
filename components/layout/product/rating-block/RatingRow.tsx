import type { FC } from 'react';

import ReviewAnimations from '../animations/ReviewAnimations';
import RatingBar from './RatingBar';
import StarRating from './StarRating';

interface RatingRowProps {
  rating: {
    value: number;
    barValue: number;
    starCount: number;
  };
  state: boolean;
}

/**
 * Rating row
 * @param rating
 * @param state
 *
 * @returns Rating row
 */
const RatingRow: FC<RatingRowProps> = ({
  rating: { value, barValue, starCount },
  state,
}) => (
  <ReviewAnimations
    className="flex h-0 w-full justify-start gap-2.5"
    index={4}
    state={state}
  >
    <div className="w-[30px] text-lg leading-5 text-neutral-600">{value}</div>
    <RatingBar value={barValue} maxWidth="200px" />
    <StarRating rating={starCount} />
  </ReviewAnimations>
);

export default RatingRow;
