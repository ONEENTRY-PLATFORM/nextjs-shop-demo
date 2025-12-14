/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import ReviewAnimations from '../../animations/ReviewAnimations';
import StarRating from '../../rating-block/StarRating';
import UserComment from './UserComment';

/**
 * ReviewCard component.
 * Displays a single product review with animation support.
 * Wraps the UserComment component with ReviewAnimations for staggered entrance effects.
 * @param   {object}           props              - Component props.
 * @param   {IAttributeValues} props.dict         - Dictionary object.
 * @param   {IProductsEntity}  props.product      - Product object entity.
 * @param   {object}           props.review       - Review object entity containing all review data.
 * @param   {Array}            props.childReviews - Array of child review objects.
 * @param   {Array}            props.allReviews   - All reviews for recursive lookup.
 * @param   {number}           props.index        - Index of this element for staggered animations.
 * @param   {boolean}          props.state        - Visibility state that triggers animation.
 * @returns {JSX.Element}                         Review card component with animation wrapper.
 */
const ReviewCard = ({
  dict,
  product,
  review,
  childReviews,
  allReviews,
  index,
  state,
}: {
  dict: IAttributeValues;
  product: IProductsEntity;
  review: any;
  childReviews: any[];
  allReviews: any[];
  index: number;
  state: boolean;
}): JSX.Element => {
  /** Extract necessary data from the review object */
  const formData = review.formData;
  /**  */
  const userName = review.userIdentifier || 'Anonymous';
  const rating = formData[0].value;
  const reviewDate = review.time
    ? new Date(review.time).toLocaleDateString('en-US')
    : '';

  return (
    <ReviewAnimations
      className="relative box-border flex h-0 shrink-0 flex-col"
      index={index}
      state={state}
    >
      {/** Display the user comment with all review details inside an animated wrapper */}
      <div className="flex flex-col w-full rounded-3xl border border-solid border-slate-300 bg-white px-10 py-7.5 max-md:px-5">
        {/** Review header with user name, date and star rating */}
        <header className="mb-4 flex justify-between gap-5 text-lg font-bold leading-8 text-neutral-600 max-md:max-w-full max-md:flex-wrap">
          {/* User name */}
          <div className="flex items-center">
            <h2 className="text-lg font-bold">{userName}</h2>
          </div>
          {/* Date and star rating */}
          <div className="flex gap-3 items-end justify-center">
            {/* Date */}
            {reviewDate && (
              <time className="text-sm font-normal text-neutral-600">
                {reviewDate}
              </time>
            )}
            {/* Rating */}
            <StarRating rating={rating} />
          </div>
        </header>

        {/** Render the user comment */}
        <UserComment
          review={review}
          product={product}
          childReviews={childReviews}
          allReviews={allReviews}
          dict={dict}
        />
      </div>
    </ReviewAnimations>
  );
};

export default ReviewCard;
