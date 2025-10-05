import type { JSX } from 'react';
import React from 'react';

import ReviewAnimations from '../animations/ReviewAnimations';
import UserComment from './UserComment';

/**
 * Review card.
 * @param   {object}      props                     - Props for component.
 * @param   {object}      props.review              - review object entity.
 * @param   {string}      props.review.name         - Name of user.
 * @param   {string}      props.review.content      - Comment text.
 * @param   {number}      props.review.likeCount    - Count of likes.
 * @param   {number}      props.review.commentCount - Count of comments.
 * @param   {number}      props.review.rating       - Rating of user.
 * @param   {number}      props.index               - Index of element for animations stagger.
 * @param   {boolean}     props.state               - state of review card.
 * @returns {JSX.Element}                           Review card component.
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
      <UserComment review={review} />
    </ReviewAnimations>
  );
};

export default ReviewCard;
