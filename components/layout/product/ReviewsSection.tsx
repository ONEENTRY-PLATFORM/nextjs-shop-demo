'use client';

import type {
  IAttributeValues,
  IFormsByMarkerDataEntity,
  IProductsEntity,
} from 'oneentry/types';
import type { JSX } from 'react';
import { useState } from 'react';

import { getReviewFormData } from '@/app/utils/getReviewFormData';

import RatingBlock from './rating-block/RatingBlock';
import RatingButton from './rating-block/RatingButton';
import ReviewsList from './reviews-list/ReviewsList';

/**
 * Calculate the average rating from parent reviews only (with parentId: null).
 *
 * The per-review rating is read by marker through the shared
 * {@link getReviewFormData} helper — the `formData` array order varies per
 * review, so positional access breaks on real data. Replies (`parentId` set)
 * carry no rating and are excluded.
 * @param   {IFormsByMarkerDataEntity | undefined} reviewsData - Reviews response from the FormsData API.
 * @returns {number}                                           Average rating, or 0 when there is no rated review.
 */
const totalRating = (reviewsData?: IFormsByMarkerDataEntity): number => {
  const items = reviewsData?.items ?? [];
  if (items.length === 0) {
    return 0;
  }

  const ratings = items
    .filter((item) => item.parentId === null)
    .map((item) => getReviewFormData(item.formData).rating)
    .filter((rating) => rating > 0);

  if (ratings.length === 0) {
    return 0;
  }

  const average =
    ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  return Number(average.toFixed(1));
};

/**
 * ReviewsSection component.
 * @param   {object}                               props             - Component props.
 * @param   {IAttributeValues}                     props.dict        - Dictionary containing localized texts from the server API.
 * @param   {IProductsEntity}                      props.product     - Product data.
 * @param   {IFormsByMarkerDataEntity | undefined} props.reviewsData - Reviews data.
 * @returns {JSX.Element}                                            Reviews section component with rating information and reviews list.
 */
const ReviewsSection = ({
  dict,
  product,
  reviewsData,
}: {
  dict: IAttributeValues;
  product: IProductsEntity;
  reviewsData?: IFormsByMarkerDataEntity | undefined;
}): JSX.Element => {
  /** State to control the visibility of the reviews list */
  const [state, setState] = useState(false);

  /** Use totalRating function to calculate the average rating */
  const averageRating = totalRating(reviewsData);

  /** Count only parent reviews (with parentId: null) */
  const parentReviewsCount =
    reviewsData?.items?.filter((review) => review.parentId === null).length ||
    0;

  return (
    <div className="flex justify-between overflow-hidden max-md:flex-wrap">
      {/** Left column: Rating button and reviews list */}
      <div className="mb-6 flex w-full flex-col gap-5">
        {/** Rating button that toggles the reviews list visibility */}
        <RatingButton
          dict={dict}
          state={state}
          setState={setState}
          totalRating={averageRating}
          reviewsCount={parentReviewsCount}
        />
        {/** Reviews list that shows/hides based on state */}
        <ReviewsList
          dict={dict}
          state={state}
          reviewsData={reviewsData}
          product={product}
        />
      </div>

      {/** Right column: Rating block with detailed rating distribution */}
      <RatingBlock
        totalRating={averageRating}
        state={state}
        dict={dict}
        product={product}
        reviewsData={reviewsData}
      />
    </div>
  );
};

export default ReviewsSection;
