'use client';

import React, { useState } from 'react';

import { productRating } from '@/components/data';

import RatingBlock from '../rating-block/RatingBlock';
import RatingButton from '../rating-block/RatingButton';
import ReviewsList from './ReviewsList';
import ViewAllButton from './ViewAllButton';

const ReviewsSection: React.FC = () => {
  const [state, setState] = useState(false);
  return (
    <div className="mb-16 flex justify-between max-md:flex-wrap">
      <div className="flex flex-col">
        <RatingButton state={state} setState={setState} {...productRating} />
        {state && <ReviewsList />}
        {state && <ViewAllButton />}
      </div>
      {state && <RatingBlock {...productRating} />}
    </div>
  );
};

export default ReviewsSection;
