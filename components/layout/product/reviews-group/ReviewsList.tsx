import React from 'react';

import { reviewsData } from '@/components/data';

import ReviewCard from './ReviewCard';

const ReviewsList: React.FC = () => {
  return (
    <section className="flex flex-col gap-5 max-md:mb-10 max-md:max-w-full">
      {reviewsData.map((review, index) => (
        <ReviewCard key={index} review={review} />
      ))}
    </section>
  );
};

export default ReviewsList;
