/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';
import { useState } from 'react';

import RatingBlock from './rating-block/RatingBlock';
import RatingButton from './rating-block/RatingButton';
import ReviewsList from './reviews-list/ReviewsList';

/**
 * Calculate the average rating from parent reviews only (with parentId: null).
 * @param   {object} reviewsData - Reviews data object containing items array.
 * @returns {number}             Average value of all formData values, or 0 if no data.
 */
const totalRating = (reviewsData: any): number => {
  if (!reviewsData?.items || reviewsData.items.length === 0) {
    return 0;
  }

  let totalSum = 0;
  let totalCount = 0;

  // Filter only parent reviews (with parentId: null)
  const parentReviews = reviewsData.items.filter(
    (item: any) => item.parentId === null,
  );

  parentReviews.forEach((item: any) => {
    if (item?.formData && Array.isArray(item.formData)) {
      item.formData.forEach((formItem: any) => {
        if (formItem?.marker === 'rating') {
          const value = Number(formItem?.value);
          if (
            !isNaN(value) &&
            formItem?.value !== undefined &&
            formItem?.value !== null
          ) {
            totalSum += value;
            totalCount++;
          }
        }
      });
    }
  });

  const average = totalCount > 0 ? totalSum / totalCount : 0;
  return isNaN(average) ? 0 : Number(average.toFixed(1));
};

/**
 * ReviewsSection component.
 * Displays the product reviews section including rating summary, toggle button, and review list.
 * This component manages the state for showing/hiding the detailed reviews list.
 * @param   {object}           props             - Component props.
 * @param   {IAttributeValues} props.dict        - Dictionary containing localized texts from the server API.
 * @param   {IProductsEntity}  props.product     - Product data.
 * @param   {object}           props.reviewsData - Reviews data.
 * @returns {JSX.Element}                        Reviews section component with rating information and reviews list.
 */
const ReviewsSection = ({
  dict,
  product,
  reviewsData,
}: {
  dict: IAttributeValues;
  product: IProductsEntity;
  reviewsData: any;
}): JSX.Element => {
  /** State to control the visibility of the reviews list */
  const [state, setState] = useState(false);

  /** Use totalRating function to calculate the average rating */
  const averageRating = totalRating(reviewsData);

  /** Count only parent reviews (with parentId: null) */
  const parentReviewsCount =
    reviewsData?.items?.filter((review: any) => review.parentId === null)
      .length || 0;

  return (
    <div className="flex justify-between overflow-hidden max-md:flex-wrap">
      {/** Left column: Rating button and reviews list */}
      <div className="flex flex-col w-full gap-5 mb-6">
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
