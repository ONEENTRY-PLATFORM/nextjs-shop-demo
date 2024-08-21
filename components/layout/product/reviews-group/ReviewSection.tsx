import React from 'react';

import ReviewsList from './ReviewList';
import ViewAllButton from './ViewAllButton';

const ReviewsSection: React.FC = () => {
  return (
    <div className="flex flex-col gap-5 max-md:mt-10 max-md:max-w-full">
      <ReviewsList />
      <ViewAllButton />
    </div>
  );
};

export default ReviewsSection;
