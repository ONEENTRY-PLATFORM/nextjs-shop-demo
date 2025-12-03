import type { JSX } from 'react';

import ReviewAnimations from '../animations/ReviewAnimations';
import UserComment from './UserComment';

/**
 * ReviewCard component.
 * Displays a single product review with animation support.
 * Wraps the UserComment component with ReviewAnimations for staggered entrance effects.
 * @param   {object}      props                     - Component props.
 * @param   {object}      props.review              - Review object entity containing all review data.
 * @param   {string}      props.review.name         - Name of the user who wrote the review.
 * @param   {string}      props.review.content      - The actual review comment text.
 * @param   {number}      props.review.likeCount    - Number of likes the review has received.
 * @param   {number}      props.review.commentCount - Number of comments on the review.
 * @param   {number}      props.review.rating       - Star rating given by the user (1-5).
 * @param   {number}      props.index               - Index of this element for staggered animations.
 * @param   {boolean}     props.state               - Visibility state that triggers animation.
 * @returns {JSX.Element}                           Review card component with animation wrapper.
 */
const ReviewCard = ({
  review,
  index,
  state,
}: {
  review: {
    name: string;
    content: string;
    likeCount: number;
    commentCount: number;
    rating: number;
  };
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
      <UserComment review={review} />
    </ReviewAnimations>
  );
};

export default ReviewCard;
