import React from 'react';
import ReviewList from './ReviewList';
import ViewAllButton from './ViewAllButton';

const ReviewSection: React.FC = () => {
  return (
    <section className="flex flex-col gap-5 max-md:mt-10 max-md:max-w-full">
      <ReviewList />
      <ViewAllButton />
    </section>
  );
};

export default ReviewSection;