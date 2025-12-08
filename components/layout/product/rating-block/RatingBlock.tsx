/* eslint-disable jsdoc/reject-any-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import { type JSX, useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import ReviewAnimations from '../animations/ReviewAnimations';
import RatingRow from './RatingRow';
import StarRating from './StarRating';

/**
 * Calculate rating distribution from reviews data.
 * @param   {any}   reviewsData - Reviews data object containing items array.
 * @returns {Array}             Array of rating distribution objects with value, barValue, and starCount.
 */
const calculateRatingDistribution = (reviewsData: any) => {
  // Initialize counters for each rating (1-5 stars)
  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  // Count ratings from reviewsData
  if (reviewsData?.items && Array.isArray(reviewsData.items)) {
    reviewsData.items.forEach((item: any) => {
      if (item?.formData && Array.isArray(item.formData)) {
        item.formData.forEach((formItem: any) => {
          if (formItem?.marker === 'rating') {
            const rating = Number(formItem?.value);
            if (!isNaN(rating) && rating >= 1 && rating <= 5) {
              ratingCounts[rating as keyof typeof ratingCounts]++;
            }
          }
        });
      }
    });
  }

  // Calculate bar values based on maximum count
  const maxCount = Math.max(...Object.values(ratingCounts));

  return [5, 4, 3, 2, 1].map((starCount) => {
    const count = ratingCounts[starCount as keyof typeof ratingCounts];
    const barValue = maxCount > 0 ? (count / maxCount) * 100 : 0;

    return {
      value: count,
      barValue: Math.round(barValue),
      starCount,
    };
  });
};

/**
 * Rating block.
 * @param   {object}           props             - Rating block props.
 * @param   {object}           props.totalRating - product rating data.
 * @param   {boolean}          props.state       - animation state
 * @param   {string}           props.lang        - language code
 * @param   {IAttributeValues} props.dict        - dictionary
 * @param   {any}              props.product     - product data
 * @param   {any}              props.reviewsData - reviews data
 * @returns {JSX.Element}                        RatingBlock component.
 */
const RatingBlock = ({
  totalRating,
  state,
  // lang,
  // dict,
  product,
  reviewsData,
}: {
  totalRating: number;
  state: boolean;
  lang: string;
  dict: IAttributeValues;
  product: any;
  reviewsData: any;
}): JSX.Element => {
  /**
   * Get drawer state and control functions from OpenDrawerContext
   * Used to open/close the sign in form drawer
   */
  const { open, setOpen, setComponent, setData } =
    useContext(OpenDrawerContext);

  // Calculate dynamic rating distribution from reviewsData
  const dynamicRatingsData = calculateRatingDistribution(reviewsData);

  return (
    <ReviewAnimations
      className="flex max-w-[420px] flex-col px-5 max-md:max-w-full"
      index={4}
      state={state}
    >
      {/** Display overall product rating with star rating and numeric value */}
      <div className="flex items-center gap-2.5 self-start text-3xl font-bold leading-8 text-neutral-600">
        <StarRating rating={totalRating} />
        <div>{totalRating}</div>
      </div>
      {/** Display detailed rating distribution */}
      <div className="mt-6 flex w-full flex-col gap-2">
        {dynamicRatingsData.map((rating, index) => (
          <RatingRow key={index} rating={rating} state={state} />
        ))}
      </div>
      {/** Leave review button */}
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          setComponent('ReviewForm');
          setData(product);
        }}
        className="btn btn-o w-full btn-md mt-5 self-end max-md:self-center"
      >
        Leave review
      </button>
    </ReviewAnimations>
  );
};

export default RatingBlock;
