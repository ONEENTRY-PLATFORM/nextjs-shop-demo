/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JSX } from 'react';

import ReviewAnimations from '../animations/ReviewAnimations';
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
  return (
    <ReviewAnimations
      className="relative box-border flex h-0 shrink-0 flex-col"
      index={index}
      state={state}
    >
      {/** Display the user comment with all review details inside an animated wrapper */}
      <div className="flex flex-col w-full rounded-3xl border border-solid border-slate-300 bg-white px-6 py-4 max-md:px-5">
        <UserComment review={review} />
      </div>
    </ReviewAnimations>
  );
};

export default ReviewCard;
