'use client';

import type { FC } from 'react';
import React, { useState } from 'react';

import { productRating } from '@/components/data';

import RatingBlock from './rating-block/RatingBlock';
import RatingButton from './rating-block/RatingButton';
import ReviewsList from './reviews-group/ReviewsList';
import ViewAllButton from './reviews-group/ViewAllButton';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const ReviewsSection: FC<{ dict: any }> = ({ dict }) => {
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
