/* eslint-disable @typescript-eslint/no-explicit-any */
import { type JSX, useState } from 'react';

import CommentForm from '@/components/forms/CommentForm';

import ChildReviews from './ChildReviews';
import RatingBlock from './RatingBlock';

/**
 * UserComment component.
 * Displays a single user review with their name, rating, comment, and engagement metrics.
 * @param   {object}      props              - UserCommentProps.
 * @param   {object}      props.product      - product object entity.
 * @param   {object}      props.review       - review object entity.
 * @param   {Array}       props.childReviews - Array of child review objects.
 * @returns {JSX.Element}                    UserComment component.
 */
const UserComment = ({
  product,
  review,
  childReviews = [],
}: {
  product: any;
  review: any;
  childReviews?: any[];
}): JSX.Element => {
  const [state, setState] = useState(false);
  const formData = review.formData;

  const content = formData[2]?.value;
  const commentsCount = childReviews.length;
  // const attachments = formData[3]?.value;

  return (
    <>
      {/** Review content and engagement metrics */}
      <div className="flex flex-col w-full items-start gap-5 text-sm max-md:max-w-full max-md:flex-wrap">
        {/** User comment text */}
        <p className="w-10/12 flex-auto self-start leading-5 text-neutral-600 max-md:max-w-full">
          {content}
        </p>

        {/** Engagement metrics (likes and comments) */}
        <div className="mt-auto flex w-full justify-between gap-2.5 whitespace-nowrap text-slate-300 max-md:w-full">
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => {
                setState(!state);
              }}
              className="text-orange-500 cursor-pointer"
            >
              Leave answer
            </button>
            {commentsCount > 0 && (
              <div className="text-orange-500">
                {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
              </div>
            )}
          </div>
          <RatingBlock />
        </div>
      </div>

      {/* Comment form */}
      {state && <CommentForm review={review} product={product} />}

      {/* Display child reviews */}
      <ChildReviews product={product} childReviews={childReviews} />
    </>
  );
};

export default UserComment;
