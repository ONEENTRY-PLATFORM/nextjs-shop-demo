import type { JSX } from 'react';
import React from 'react';

import ReviewAnimations from '../animations/ReviewAnimations';
import UserComment from './UserComment';

/**
 * Review card.
 *
 * @param props - Props for component.
 * @param props.review - review object entity.
 * @param props.review.name - Name of user.
 * @param props.review.content - Comment text.
 * @param props.review.likeCount - Count of likes.
 * @param props.review.commentCount - Count of comments.
 * @param props.review.rating - Rating of user.
 * @param props.index - Index of element for animations stagger.
 * @param props.state - state of review card.
 *
 * @returns Review card component.
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
