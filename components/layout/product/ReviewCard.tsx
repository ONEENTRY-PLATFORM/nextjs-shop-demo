import React from "react";

interface ReviewCardProps {
  content?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ content }) => {
  return (
    <article className="box-border flex relative flex-col shrink-0">
      {content || "Review content placeholder"}
    </article>
  );
};

export default ReviewCard;
