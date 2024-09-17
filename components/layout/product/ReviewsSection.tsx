'use client';

import React, { useState } from 'react';

import { productRating } from '@/components/data';

import RatingBlock from './rating-block/RatingBlock';
import RatingButton from './rating-block/RatingButton';
import ReviewsList from './reviews-group/ReviewsList';
import ViewAllButton from './reviews-group/ViewAllButton';

const ReviewsSection: React.FC = () => {
  const [state, setState] = useState(false);
  return (
    <div className="flex justify-between max-md:flex-wrap">
      <div className="flex flex-col">
        <RatingButton state={state} setState={setState} {...productRating} />
        {state && (
          <>
            <ReviewsList />
            <ViewAllButton />
          </>
        )}
      </div>
      {state && <RatingBlock {...productRating} />}
    </div>
  );
};

export default ReviewsSection;
