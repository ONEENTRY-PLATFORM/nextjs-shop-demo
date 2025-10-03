import type { JSX } from 'react';
import React from 'react';

import ReviewAnimations from '../animations/ReviewAnimations';
import UserComment from './UserComment';

/**
 * User comment object entity.
 *
 * @property name - Name of user.
 * @property content - Comment text.
 * @property likeCount - Count of likes.
 * @property commentCount - Count of comments.
 * @property rating - Rating of user.
 */
interface UserCommentProps {
  name: string;
  content: string;
  likeCount: number;
  commentCount: number;
  rating: number;
}

/**
 * Review card props.
 *
 * @property review - review object entity.
 * @property index - Index of element for animations stagger.
 * @property state - state of review card.
 */
interface ReviewCardProps {
  review: UserCommentProps;
  index: number;
  state: boolean;
}

/**
 * Review card.
 *
 * @param review - review object entity.
 * @param index - Index of element for animations stagger.
 * @param state - state of review card.
 *
 * @returns Review card.
 */
const ReviewCard = ({ review, index, state }: ReviewCardProps): JSX.Element => {
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
