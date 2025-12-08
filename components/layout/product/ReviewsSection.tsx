/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';
import { useState } from 'react';

// import { ReviewForm } from '@/components/forms';
import RatingBlock from './rating-block/RatingBlock';
import RatingButton from './rating-block/RatingButton';
import ReviewsList from './reviews-group/ReviewsList';

export const productRating = {
  rating: 4.7,
  reviewCount: 7979,
};

/**
 * Calculate the average rating from all formData values across all reviews.
 * @param   {any}    reviewsData - Reviews data object containing items array.
 * @returns {number}             Average value of all formData values, or 0 if no data.
 */
const totalRating = (reviewsData: any): number => {
  if (!reviewsData?.items || reviewsData.items.length === 0) {
    return 0;
  }

  let totalSum = 0;
  let totalCount = 0;

  reviewsData.items.forEach((item: any) => {
    if (item?.formData && Array.isArray(item.formData)) {
      item.formData.forEach((formItem: any) => {
        const value = Number(formItem?.value);
        if (
          !isNaN(value) &&
          formItem?.value !== undefined &&
          formItem?.value !== null
        ) {
          totalSum += value;
          totalCount++;
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
 * @param   {string}           props.lang        - Language code.
 * @param   {IAttributeValues} props.dict        - Dictionary containing localized texts from the server API.
 * @param   {IProductsEntity}  props.product     - Product data.
 * @param   {any}              props.reviewsData - Reviews data.
 * @returns {JSX.Element}                        Reviews section component with rating information and reviews list.
 */
const ReviewsSection = ({
  lang,
  dict,
  product,
  reviewsData,
}: {
  lang: string;
  dict: IAttributeValues;
  product: IProductsEntity;
  reviewsData: any;
}): JSX.Element => {
  /** State to control the visibility of the reviews list */
  const [state, setState] = useState(true);
  const averageRating = totalRating(reviewsData);

  return (
    <div className="flex justify-between overflow-hidden max-md:flex-wrap">
      {/** Left column: Rating button and reviews list */}
      <div className="flex flex-col w-full">
        {/** Rating button that toggles the reviews list visibility */}
        <RatingButton
          dict={dict}
          state={state}
          setState={setState}
          totalRating={averageRating}
          reviewsCount={reviewsData.total}
        />
        {/** Reviews list that shows/hides based on state */}
        <ReviewsList state={state} reviewsData={reviewsData} />
      </div>

      {/** Right column: Rating block with detailed rating distribution */}
      <RatingBlock
        totalRating={averageRating}
        state={state}
        lang={lang}
        dict={dict}
        product={product}
        reviewsData={reviewsData}
      />
    </div>
  );
};

export default ReviewsSection;
