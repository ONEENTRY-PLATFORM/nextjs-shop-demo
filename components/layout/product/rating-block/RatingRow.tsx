import type { JSX } from 'react';

import ReviewAnimations from '../animations/ReviewAnimations';
import RatingBar from './RatingBar';
import StarRating from './StarRating';

/**
 * Rating row.
 * @param   {object}      props                  - Rating row props.
 * @param   {object}      props.rating           - Rating object with rating value, bar value and star count.
 * @param   {number}      props.rating.value     - Rating value.
 * @param   {number}      props.rating.barValue  - Rating bar value.
 * @param   {number}      props.rating.starCount - Rating star count.
 * @param   {boolean}     props.state            - State of the rating.
 * @returns {JSX.Element}                        Rating row component.
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
    {/** Display the rating value (number of stars) */}
    <div className="w-[30px] text-lg leading-5 text-neutral-600">{value}</div>
    {/** Display the rating bar showing the percentage of reviews with this rating */}
    <RatingBar value={barValue} maxWidth="200px" />
    {/** Display the star rating for this row */}
    <StarRating rating={starCount} />
  </ReviewAnimations>
);

export default RatingRow;
