import type { JSX } from 'react';

import LikeIcon from '@/components/icons/like';

import StarRating from '../rating-block/StarRating';

/**
 * UserComment component.
 * Displays a single user review with their name, rating, comment, and engagement metrics.
 * @param   {object}      props                     - UserCommentProps.
 * @param   {object}      props.review              - review object entity.
 * @param   {string}      props.review.name         - user name.
 * @param   {string}      props.review.content      - user comment.
 * @param   {number}      props.review.likeCount    - user likes count.
 * @param   {number}      props.review.commentCount - user comments count.
 * @param   {number}      props.review.rating       - user rating.
 * @returns {JSX.Element}                           UserComment component.
 */
const UserComment = ({
  review,
}: {
  review: {
    name: string;
    content: string;
    likeCount: number;
    commentCount: number;
    rating: number;
  };
}): JSX.Element => {
  return (
    <div className="flex flex-col rounded-3xl border border-solid border-slate-300 bg-white px-6 py-4 max-md:px-5">
      {/** Review header with user name and star rating */}
      <header className="mb-4 flex justify-between gap-5 text-lg font-bold leading-8 text-neutral-600 max-md:max-w-full max-md:flex-wrap">
        <h2>{review.name}</h2>
        <StarRating rating={review.rating} />
      </header>

      {/** Review content and engagement metrics */}
      <div className="flex w-full items-start gap-5 text-sm max-md:max-w-full max-md:flex-wrap">
        {/** User comment text */}
        <p className="w-10/12 flex-auto self-start leading-5 text-neutral-600 max-md:max-w-full">
          {review.content}
        </p>

        {/** Engagement metrics (likes and comments) */}
        <div className="mt-auto flex w-2/12 justify-end gap-2.5 self-end whitespace-nowrap text-slate-300 max-md:w-full">
          {/** Like counter with icon */}
          <div className="relative box-border flex shrink-0 flex-row gap-1">
            <LikeIcon />
            <div className="my-auto">{review.likeCount}</div>
          </div>

          {/** Comment counter with icon (rotated like icon) */}
          <div className="relative box-border flex shrink-0 flex-row gap-1">
            <span className="rotate-180">
              <LikeIcon />
            </span>
            <div className="my-auto">{review.commentCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserComment;
