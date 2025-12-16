'use client';

import '@/app/styles/slick.css';
import '@/app/styles/slick-theme.css';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';
import { useContext, useState } from 'react';
import type Slider from 'react-slick';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import CommentForm from '@/components/forms/CommentForm';

import StarRating from '../../rating-block/StarRating';
import RatingBlock from '../LikesBlock';
import ChildReviews from '../review-card/ChildReviews';
import ImagesCarousel from './ImagesCarousel';
import ModalHeading from './ModalHeading';
import ReviewImages from './ReviewImages';
import TotalComments from './TotalComments';

/**
 * ReviewModal component.
 * Displays a detailed review in a modal with images, comments, and interactions.
 * @param   {object}           props      - Component props.
 * @param   {IAttributeValues} props.dict - Dictionary object.
 * @returns {JSX.Element}                 ReviewModal component.
 */
const ReviewModal = ({ dict }: { dict: IAttributeValues }): JSX.Element => {
  /** State for slider navigation */
  const [nav1, setNav1] = useState<Slider | null>(null);
  const [nav2, setNav2] = useState<Slider | null>(null);

  // const { authenticate } = useContext(AuthContext);
  const { data: reviewData } = useContext(OpenDrawerContext);
  // Extract data from review
  const { product, review, allReviews, childReviews } = reviewData;
  const formData = review?.formData || [];
  const userName = review?.userIdentifier || 'Anonymous';

  // Extract rating
  const rating = formData[0]?.value || 0;
  /** Extract review images from formData */
  const reviewImages = formData[1]?.value || [];
  // Extract content
  const content = formData[2]?.value || '';

  const reviewDate = review?.time
    ? new Date(review.time).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '11.08.2025';

  return (
    <div className="flex flex-col gap-5">
      {/* Heading */}
      <ModalHeading product={product} />

      {/* User Product images and review content */}
      <div className="grid grid-cols-2 max-h-100">
        {/* User images carousel */}
        <div className="flex flex-row max-h-100">
          <ImagesCarousel
            reviewImages={reviewImages}
            nav2={nav2}
            setNav1={setNav1}
          />
        </div>

        {/* Review content */}
        <div className="flex flex-col gap-3.5 px-4 overflow-y-auto max-h-full">
          {/* Review header */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[18px] font-bold text-neutral-800">
              {userName}
            </h3>
            <StarRating rating={rating} />
          </div>

          {/* Review date */}
          <time className="text-sm text-neutral-500">{reviewDate}</time>

          {/* Thumbnail navigation slider - review images */}
          <div className="flex gap-2 flex-wrap">
            <ReviewImages
              reviewImages={reviewImages}
              nav1={nav1}
              setNav2={setNav2}
            />
          </div>

          {/* Review text */}
          <p className="text-neutral-600 leading-relaxed">{content}</p>

          {/* !!! Like/Dislike buttons */}
          <div className="flex self-end">
            <RatingBlock />
          </div>

          {/* Comments section */}
          <div className="">
            <TotalComments allReviews={allReviews} review={review} />

            {/* Comment input */}
            <div className="mb-6 flex gap-2">
              <CommentForm review={review} product={product} dict={dict} />
            </div>

            {/* Display child reviews */}
            <ChildReviews
              dict={dict}
              product={product}
              allReviews={allReviews}
              childReviews={childReviews}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
