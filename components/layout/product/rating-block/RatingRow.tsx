import type { JSX } from 'react';

import ReviewAnimations from '../animations/ReviewAnimations';
import RatingBar from './RatingBar';
import StarRating from './StarRating';

/**
 * Rating row.
 *
 * @param props - Rating row props.
 * @param props.rating - Rating object with rating value, bar value and star count.
 * @param props.rating.value - Rating value.
 * @param props.rating.barValue - Rating bar value.
 * @param props.rating.starCount - Rating star count.
 * @param props.state - State of the rating.
 *
 * @returns Rating row component.
 */
const RatingRow = ({
  rating: { value, barValue, starCount },
  state,
}: {
  rating: {
    value: number;
    barValue: number;
    starCount: number;
  };
  state: boolean;
}): JSX.Element => (
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
