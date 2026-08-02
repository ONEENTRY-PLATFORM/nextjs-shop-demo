import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IFormsByMarkerDataEntity } from 'oneentry/dist/forms-data/formsDataInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { type JSX, useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import { getReviewFormData } from '@/app/utils/getReviewFormData';

import ReviewAnimations from '../animations/ReviewAnimations';
import RatingRow from './RatingRow';
import StarRating from './StarRating';

/**
 * One bar of the rating histogram.
 * @property {number} value     - How many reviews carry this star count.
 * @property {number} barValue  - Bar width in percent of the most frequent rating.
 * @property {number} starCount - The star count this row represents (5…1).
 */
type RatingDistributionRow = {
  value: number;
  barValue: number;
  starCount: number;
};

/**
 * Calculate rating distribution from reviews data.
 *
 * Ratings are read by marker through the shared {@link getReviewFormData}
 * helper — the `formData` array order varies per review.
 * @param   {IFormsByMarkerDataEntity | undefined} reviewsData - Reviews response from the FormsData API.
 * @returns {RatingDistributionRow[]}                          Histogram rows from 5 stars down to 1.
 */
const calculateRatingDistribution = (
  reviewsData?: IFormsByMarkerDataEntity,
): RatingDistributionRow[] => {
  /** Initialize counters for each rating (1-5 stars) */
  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  /** Count ratings from reviewsData */
  for (const item of reviewsData?.items ?? []) {
    const rating = getReviewFormData(item.formData).rating;
    if (rating >= 1 && rating <= 5) {
      ratingCounts[rating as keyof typeof ratingCounts]++;
    }
  }

  /** Calculate bar values based on maximum count */
  const maxCount = Math.max(...Object.values(ratingCounts));

  /** Map each rating to a rating distribution object */
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
 * @param   {object}                               props             - Rating block props.
 * @param   {IAttributeValues}                     props.dict        - dictionary
 * @param   {number}                               props.totalRating - product rating data.
 * @param   {boolean}                              props.state       - animation state
 * @param   {IProductsEntity}                      props.product     - product data
 * @param   {IFormsByMarkerDataEntity | undefined} props.reviewsData - reviews data
 * @returns {JSX.Element}                                            RatingBlock component.
 */
const RatingBlock = ({
  // dict,
  totalRating,
  state,
  product,
  reviewsData,
}: {
  totalRating: number;
  state: boolean;
  dict: IAttributeValues;
  product: IProductsEntity;
  reviewsData?: IFormsByMarkerDataEntity | undefined;
}): JSX.Element => {
  /**
   * Get drawer state and control functions from OpenDrawerContext
   * Used to open/close the sign in form drawer
   */
  const { open, setOpen, setComponent, setData } =
    useContext(OpenDrawerContext);

  // Calculate dynamic rating distribution from reviewsData
  const dynamicRatingsData = calculateRatingDistribution(reviewsData);
  const leave_review_text = 'Leave review';

  return (
    <ReviewAnimations
      className="flex max-w-105 flex-col px-5 max-md:max-w-full"
      index={4}
      state={state}
    >
      {/** Display overall product rating with star rating and numeric value */}
      <div className="flex items-center gap-2.5 self-start text-3xl leading-8 font-bold text-neutral-600">
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
        className="btn btn-o btn-o-primary btn-md mt-5 w-full self-end max-md:self-center"
      >
        {leave_review_text}
      </button>
    </ReviewAnimations>
  );
};

export default RatingBlock;
