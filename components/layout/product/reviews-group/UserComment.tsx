/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JSX } from 'react';

import LikeIcon from '@/components/icons/like';

import StarRating from '../rating-block/StarRating';

/**
 * UserComment component.
 * Displays a single user review with their name, rating, comment, and engagement metrics.
 * @param   {object}      props        - UserCommentProps.
 * @param   {object}      props.review - review object entity.
 * @returns {JSX.Element}              UserComment component.
 */
const UserComment = ({ review }: { review: any }): JSX.Element => {
  // console.log(review);
  // console.log(review.formData);
  const formData = review.formData;
  const rating = formData[0].value;
  const content = formData[1]?.value;

  return (
    <>
      {/** Review header with user name and star rating */}
      <header className="mb-4 flex justify-between gap-5 text-lg font-bold leading-8 text-neutral-600 max-md:max-w-full max-md:flex-wrap">
        <h2>{review.name}</h2>
        <StarRating rating={rating} />
      </header>

      {/** Review content and engagement metrics */}
      <div className="flex flex-col w-full items-start gap-5 text-sm max-md:max-w-full max-md:flex-wrap">
        {/** User comment text */}
        <p className="w-10/12 flex-auto self-start leading-5 text-neutral-600 max-md:max-w-full">
          {content}
        </p>

        {/** Engagement metrics (likes and comments) */}
        <div className="mt-auto flex w-full justify-between gap-2.5 whitespace-nowrap text-slate-300 max-md:w-full">
          <div className="flex gap-2.5">
            <div className="text-orange-500">Leave answer</div>
            <div className="text-orange-500">1 comment</div>
          </div>
          <div className="flex">
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
    </>
  );
};

export default UserComment;
