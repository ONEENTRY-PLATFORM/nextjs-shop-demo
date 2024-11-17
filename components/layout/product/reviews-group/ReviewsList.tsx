import type { FC } from 'react';
import React from 'react';

import { reviewsData } from '@/components/data';

import ReviewCard from './ReviewCard';
import ViewAllButton from './ViewAllButton';

/**
 * Reviews list section
 * @param state open/closed list state
 *
 * @returns ReviewsList
 */
const ReviewsList: FC<{ state: boolean }> = ({ state }) => {
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
