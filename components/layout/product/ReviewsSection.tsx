'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FC } from 'react';
import React, { useState } from 'react';

import { productRating } from '@/components/data';

import RatingBlock from './rating-block/RatingBlock';
import RatingButton from './rating-block/RatingButton';
import ReviewsList from './reviews-group/ReviewsList';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ReviewsSection: FC<{ dict: IAttributeValues }> = ({ dict }) => {
  const [state, setState] = useState(false);
  return (
    <div className="flex justify-between overflow-hidden max-md:flex-wrap">
      <div className="flex flex-col">
        <RatingButton state={state} setState={setState} {...productRating} />
        <ReviewsList state={state} />
      </div>
      <RatingBlock productRating={productRating} state={state} />
    </div>
  );
};

export default ReviewsSection;
