/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JSX } from 'react';

import ReviewAnimations from '../animations/ReviewAnimations';
import StarRating from '../rating-block/StarRating';
import UserComment from './UserComment';

/**
 * ReviewCard component.
 * Displays a single product review with animation support.
 * Wraps the UserComment component with ReviewAnimations for staggered entrance effects.
 * @param   {object}      props        - Component props.
 * @param   {object}      props.review - Review object entity containing all review data.
 * @param   {number}      props.index  - Index of this element for staggered animations.
 * @param   {boolean}     props.state  - Visibility state that triggers animation.
 * @returns {JSX.Element}              Review card component with animation wrapper.
 */
const ReviewCard = ({
  review,
  index,
  state,
}: {
  review: any;
  index: number;
  state: boolean;
}): JSX.Element => {
  const formData = review.formData;

  const rating = formData[0].value;
  return (
    <ReviewAnimations
      className="relative box-border flex h-0 shrink-0 flex-col"
      index={index}
      state={state}
    >
      {/** Display the user comment with all review details inside an animated wrapper */}
      <div className="flex flex-col w-full rounded-3xl border border-solid border-slate-300 bg-white px-6 py-4 max-md:px-5">
        {/** Review header with user name and star rating */}
        <header className="mb-4 flex justify-between gap-5 text-lg font-bold leading-8 text-neutral-600 max-md:max-w-full max-md:flex-wrap">
          <h2>{review.name}</h2>
          <StarRating rating={rating} />
        </header>
        <UserComment review={review} />
      </div>
    </ReviewAnimations>
  );
};

export default ReviewCard;
