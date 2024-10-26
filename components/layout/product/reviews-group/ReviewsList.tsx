import type { FC } from 'react';
import React from 'react';

import { reviewsData } from '@/components/data';

import ReviewCard from './ReviewCard';
import ViewAllButton from './ViewAllButton';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReviewsList: FC<{ state: any }> = ({ state }) => {
  return (
    <>
      <section
        className={
          'flex flex-col max-md:mb-10 max-md:max-w-full ' +
          (state ? 'gap-5' : '')
        }
      >
        {reviewsData.map((review, index) => (
          <ReviewCard key={index} review={review} index={index} state={state} />
        ))}
      </section>
      <ViewAllButton state={state} />
    </>
  );
};

export default ReviewsList;
