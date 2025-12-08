/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JSX } from 'react';

import ReviewAnimations from '../animations/ReviewAnimations';
import StarRating from '../rating-block/StarRating';
import UserComment from './UserComment';

/**
 * ReviewCard component.
 * Displays a single product review with animation support.
 * Wraps the UserComment component with ReviewAnimations for staggered entrance effects.
 * @param   {object}      props              - Component props.
 * @param   {object}      props.lang         - Language code.
 * @param   {object}      props.product      - Product object entity.
 * @param   {object}      props.review       - Review object entity containing all review data.
 * @param   {Array}       props.childReviews - Array of child review objects.
 * @param   {number}      props.index        - Index of this element for staggered animations.
 * @param   {boolean}     props.state        - Visibility state that triggers animation.
 * @returns {JSX.Element}                    Review card component with animation wrapper.
 */
const ReviewCard = ({
  lang,
  product,
  review,
  childReviews,
  index,
  state,
}: {
  lang: any;
  product: any;
  review: any;
  childReviews: any[];
  index: number;
  state: boolean;
}): JSX.Element => {
  const formData = review.formData;
  const userName = review.userIdentifier;
  const rating = formData[0].value;
  const reviewDate = review.localizeInfos?.updatedDate
    ? new Date(review.localizeInfos.updatedDate).toLocaleDateString('en-GB')
    : '';

  return (
    <ReviewAnimations
      className="relative box-border flex h-0 shrink-0 flex-col"
      index={index}
      state={state}
    >
      {/** Display the user comment with all review details inside an animated wrapper */}
      <div className="flex flex-col w-full rounded-3xl border border-solid border-slate-300 bg-white px-6 py-4 max-md:px-5">
        {/** Review header with user name, date and star rating */}
        <header className="mb-4 flex justify-between gap-5 text-lg font-bold leading-8 text-neutral-600 max-md:max-w-full max-md:flex-wrap">
          <div className="flex items-center gap-3">
            <h2>{userName}</h2>
            {reviewDate && (
              <time className="text-sm font-normal text-neutral-600">
                {reviewDate}
              </time>
            )}
          </div>
          <StarRating rating={rating} />
        </header>
        {/** Render the user comment */}
        <UserComment
          lang={lang}
          review={review}
          product={product}
          childReviews={childReviews}
        />
      </div>
    </ReviewAnimations>
  );
};

export default ReviewCard;
