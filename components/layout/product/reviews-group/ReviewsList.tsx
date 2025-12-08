/* eslint-disable jsdoc/reject-any-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { type JSX, Key, useEffect, useState } from 'react';

import { api } from '@/app/api';

import ReviewCard from './ReviewCard';
import ViewAllButton from './ViewAllButton';

// const reviewsData = [
//   {
//     name: 'Ahmet K.',
//     avatarSrc: '',
//     content:
//       'Lorem ipsum dolor sit amet consectetur. Sit consequat laoreet arcu odio volutpat. Diam eget vitae vulputate integer volutpat nec. Iaculis neque tristique sed id ultrices sed. Pharetra duis eget adipiscing rhoncus diam sagittis turpis ac. Sit consequat quis enim ac platea gravida.',
//     likeCount: 17,
//     commentCount: 0,
//     rating: 5,
//   },
//   {
//     name: 'Sit consequat',
//     avatarSrc: '',
//     content:
//       'Sit consequat laoreet arcu odio volutpat. Diam eget vitae vulputate integer volutpat nec. Iaculis neque tristique sed id ultrices sed. Pharetra duis eget adipiscing rhoncus diam sagittis turpis ac. Sit consequat quis enim ac platea gravida.',
//     likeCount: 7,
//     commentCount: 4,
//     rating: 3,
//   },
//   {
//     name: 'Diam eget',
//     avatarSrc: '',
//     content:
//       'Lorem ipsum dolor sit amet consectetur. Diam eget vitae vulputate integer volutpat nec. Iaculis neque tristique sed id ultrices sed. Pharetra duis eget adipiscing rhoncus diam sagittis turpis ac. Sit consequat quis enim ac platea gravida.',
//     likeCount: 17,
//     commentCount: 0,
//     rating: 2,
//   },
//   {
//     name: 'Lorem ipsum',
//     avatarSrc: '',
//     content:
//       'Lorem ipsum dolor. Diam eget vitae vulputate integer volutpat nec. Iaculis neque tristique sed id ultrices sed. Pharetra duis eget adipiscing rhoncus diam sagittis turpis ac. Sit consequat quis enim ac platea gravida.',
//     likeCount: 32,
//     commentCount: 2,
//     rating: 4,
//   },
// ];

/**
 * ReviewsList component.
 * Displays a list of product reviews with conditional styling based on visibility state.
 * Renders individual ReviewCard components for each review and includes a ViewAllButton.
 * @param   {object}      props             - Component props.
 * @param   {boolean}     props.state       - Visibility state that controls the layout spacing and ReviewCard animations.
 * @param   {any}         props.reviewsData - Array of review objects.
 * @returns {JSX.Element}                   Reviews list section with all reviews and a view all button.
 */
const ReviewsList = ({
  state,
  reviewsData,
}: {
  state: boolean;
  reviewsData: any;
}): JSX.Element => {
  if (!reviewsData || reviewsData.length < 1) {
    return (
      <div className="flex text-center w-full h-50 justify-center items-center">
        <h2 className="text-2xl">There no reviews yet</h2>
      </div>
    );
  }

  return (
    <>
      {/** Reviews container with dynamic spacing based on state */}
      <section
        className={
          'flex flex-col max-md:mb-10 max-md:max-w-full ' +
          (state ? 'gap-5' : '')
        }
      >
        {/** Map through all reviews and render a ReviewCard for each one */}
        {reviewsData.items?.map((review: any, index: number) => (
          <ReviewCard key={index} review={review} index={index} state={state} />
        ))}
      </section>
      {/** View all reviews button with animation support */}
      {reviewsData.length > 0 && <ViewAllButton state={state} />}
    </>
  );
};

export default ReviewsList;
