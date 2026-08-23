'use client';

import type {
  IAttributeValues,
  IFormByMarkerDataEntity,
  IFormsByMarkerDataEntity,
  IProductsEntity,
} from 'oneentry/types';
import type { JSX } from 'react';
import { useState } from 'react';

import ReviewCard from './review-card/ReviewCard';
import ViewAllButton from './ViewAllButton';

/**
 * ReviewsList component.
 * Displays a list of product reviews with conditional styling based on visibility state.
 * Renders individual ReviewCard components for each review and includes a ViewAllButton.
 * @param   {object}                               props             - Component props.
 * @param   {IAttributeValues}                     props.dict        - Dictionary object containing translations.
 * @param   {boolean}                              props.state       - Visibility state that controls the layout spacing and ReviewCard animations.
 * @param   {IFormsByMarkerDataEntity | undefined} props.reviewsData - Reviews response from the FormsData API.
 * @param   {IProductsEntity}                      props.product     - Product object.
 * @returns {JSX.Element}                                            Reviews list section with all reviews and a view all button.
 */
const ReviewsList = ({
  dict,
  state,
  product,
  reviewsData,
}: {
  dict: IAttributeValues;
  state: boolean;
  product: IProductsEntity;
  reviewsData?: IFormsByMarkerDataEntity | undefined;
}): JSX.Element => {
  const [showAll, setShowAll] = useState(false);
  const { no_reviews_text } = dict;

  const INITIAL_REVIEWS_COUNT = 2;

  /** Check if there are any reviews available and return a message if none are found (only when expanded) */
  if (!reviewsData || reviewsData.items.length < 1) {
    if (!state) {
      return <></>;
    }
    return (
      <div className="flex h-50 w-full items-center justify-center text-center">
        <h2 className="text-2xl">
          {(no_reviews_text?.value as string) || 'There no reviews yet'}
        </h2>
      </div>
    );
  }

  /** Filter parent reviews (with parentId: null) */
  const parentReviews = reviewsData.items?.filter(
    (review) => review.parentId === null,
  );

  /** Group direct child reviews by their parent ID */
  const childReviewsByParentId = reviewsData.items?.reduce(
    (acc: Record<number, IFormByMarkerDataEntity[]>, review) => {
      if (review.parentId !== null && review.parentId !== undefined) {
        const bucket = acc[review.parentId];
        if (bucket) {
          bucket.push(review);
        } else {
          acc[review.parentId] = [review];
        }
      }
      return acc;
    },
    {},
  );

  /** Determine which reviews to display based on showAll state */
  const displayedReviews = showAll
    ? parentReviews
    : parentReviews?.slice(0, INITIAL_REVIEWS_COUNT);

  /** Check if there are more reviews to show */
  const hasMoreReviews = parentReviews?.length > INITIAL_REVIEWS_COUNT;

  return (
    <>
      {/** Reviews container with dynamic spacing based on state */}
      <section
        className={
          'flex flex-col max-md:mb-10 max-md:max-w-full ' +
          (state ? 'gap-5' : '')
        }
      >
        {/** Map through displayed reviews and render a ReviewCard for each one */}
        {displayedReviews?.map((review, index: number) => (
          <ReviewCard
            key={review.id}
            review={review}
            childReviews={childReviewsByParentId[review.id] || []}
            allReviews={reviewsData.items || []}
            index={index}
            state={state}
            product={product}
            dict={dict}
          />
        ))}
      </section>
      {/** View all reviews button with animation support */}
      {hasMoreReviews && !showAll && (
        <ViewAllButton state={state} onClick={() => setShowAll(true)} />
      )}
    </>
  );
};

export default ReviewsList;
