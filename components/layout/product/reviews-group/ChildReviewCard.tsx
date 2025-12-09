/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { type JSX, useState } from 'react';

import CommentForm from '@/components/forms/CommentForm';

import RatingBlock from './RatingBlock';

/**
 * Child review
 * @param   {object}          props         - Child review props
 * @param   {IProductsEntity} props.product - Product
 * @param   {object}          props.review  - Review
 * @returns {JSX.Element}                   Child review
 */
const ChildReview = ({
  product,
  review,
}: {
  product: IProductsEntity;
  review: any;
}): JSX.Element => {
  const [state, setState] = useState(false);

  const childFormData = review.formData;
  const userName = review.userIdentifier;
  const content = childFormData[2]?.value;
  const reviewDate = review.time
    ? new Date(review.time).toLocaleDateString('en-US')
    : '';

  return (
    <div className="flex gap-4 border-l-4 border-orange-500 pl-6">
      <div className="flex flex-col gap-3 flex-1">
        {/** Child review header with name and date */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-neutral-600">{userName}</h3>
          </div>
          {reviewDate && (
            <time className="text-sm text-neutral-600">{reviewDate}</time>
          )}
        </div>

        {/** Child review content */}
        <p className="text-sm leading-5 text-neutral-600">{content}</p>

        {/** Child review actions */}
        <div className="flex items-center gap-4">
          {/** Leave answer */}
          <button
            type="button"
            onClick={() => setState(!state)}
            className="text-orange-500 text-sm cursor-pointer hover:underline"
          >
            Leave answer
          </button>

          {/** Like and dislike buttons */}
          <div className="flex items-center gap-4 ml-auto">
            <RatingBlock />
          </div>
        </div>

        {/* Comment form */}
        {state && <CommentForm review={review} product={product} />}
      </div>
    </div>
  );
};

export default ChildReview;
