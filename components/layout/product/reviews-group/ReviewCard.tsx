import type { FC } from 'react';
import React from 'react';

import ReviewAnimations from '../animations/ReviewAnimations';
import UserComment from './UserComment';

interface UserCommentProps {
  name: string;
  content: string;
  likeCount: number;
  commentCount: number;
  rating: number;
}

interface ReviewCardProps {
  review: UserCommentProps;
  index: number;
  state: boolean;
}

/**
 * Review card
 *
 * @param review review object entity
 * @param index Index of element for animations stagger
 * @param state state of review card
 *
 * @returns Review card
 */
const ReviewCard: FC<ReviewCardProps> = ({ review, index, state }) => {
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
