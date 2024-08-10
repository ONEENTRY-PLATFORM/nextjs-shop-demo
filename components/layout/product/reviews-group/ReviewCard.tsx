import React from 'react';

interface ReviewCardProps {
  content?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ content }) => {
  return (
    <article className="relative box-border flex shrink-0 flex-col">
      {content || 'Review content placeholder'}
    </article>
  );
};

export default ReviewCard;
