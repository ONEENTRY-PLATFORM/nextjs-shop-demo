import type { JSX } from 'react';

import ReviewAnimations from '../animations/ReviewAnimations';
import RatingBar from './RatingBar';
import StarRating from './StarRating';

/**
 * Rating row props.
 *
 * @property rating - Rating object.
 * @property rating.value - Rating value.
 * @property rating.barValue - Rating bar value.
 * @property rating.starCount - Rating star count.
 * @property state - State of the rating.
 */
interface RatingRowProps {
  rating: {
    value: number;
    barValue: number;
    starCount: number;
  };
  state: boolean;
}

/**
 * Rating row.
 *
 * @param props - Rating row props.
 * @param props.rating - Rating object.
 * @param props.state - State of the rating.
 *
 * @returns Rating row.
 */
const RatingRow = ({
  rating: { value, barValue, starCount },
  state,
}: RatingRowProps): JSX.Element => (
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
