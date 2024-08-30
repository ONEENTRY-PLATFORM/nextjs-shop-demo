import React from 'react';

import { reviewsData } from '@/components/data';
import { productRating } from '@/components/data';

import RatingBlock from '../rating-block/RatingBlock';
import RatingButton from '../rating-block/RatingButton';
import ReviewCard from './ReviewCard';

const ReviewsSection: React.FC = () => {
  return (
    <div className="mb-16 flex justify-between max-md:flex-wrap">
      <div className="flex flex-col">
        <div className="mb-6">
          <RatingButton {...productRating} />
        </div>
        <section className="flex flex-col gap-5 max-md:mb-10 max-md:max-w-full">
          {reviewsData.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </section>
        <div className="flex flex-col gap-5 max-md:mb-10 max-md:max-w-full">
          <button
            type="button"
            className="mt-5 self-end rounded-[30px] border border-solid border-orange-500 px-16 py-4 max-md:px-5"
          >
            View all reviews
          </button>
        </div>
      </div>
      <RatingBlock {...productRating} />
    </div>
  );
};

export default ReviewsSection;
