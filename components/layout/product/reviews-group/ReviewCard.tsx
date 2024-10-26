/* eslint-disable @next/next/no-img-element */
import type { FC } from 'react';
import React from 'react';

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
}

const ReviewCard: FC<ReviewCardProps> = ({ review, index }) => {
  return (
    <article className="relative box-border flex shrink-0 flex-col">
      <UserComment review={review} index={index} />
    </article>
  );
};

export default ReviewCard;
