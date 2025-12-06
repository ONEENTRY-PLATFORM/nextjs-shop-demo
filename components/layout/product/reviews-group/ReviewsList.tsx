/* eslint-disable jsdoc/reject-any-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { type JSX, useEffect, useState } from 'react';

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
 * @param   {object}      props         - Component props.
 * @param   {boolean}     props.state   - Visibility state that controls the layout spacing and ReviewCard animations.
 * @param   {any}         props.product - Product object.
 * @returns {JSX.Element}               Reviews list section with all reviews and a view all button.
 */
const ReviewsList = ({
  state,
  product,
}: {
  state: boolean;
  product: IProductsEntity;
}): JSX.Element => {
  const [reviewsData, setReviewsData] = useState<any[]>([]);
  /** Fetch reviews data from the API when the component mounts. */
  useEffect(() => {
    /** Fetch reviews */
    const fetchReviews = async () => {
      const result = await api.FormData.getFormsDataByMarker(
        'comment_to_product', // marker - Form marker
        5, // formModuleConfigId - Form module configuration ID
        {
          entityIdentifier: product.id,
          userIdentifier: '',
          status: 'approved',
          dateFrom: '',
          dateTo: '',
        }, // body - Request body.
        1, // isNested - Flag for getting hierarchical data.
        'en_US', // langCode - Language code.
        0, // offset — Parameter for pagination. Default: 0.
        2, // limit — Parameter for pagination. Default: 30.
      );

      /** Check if result is an error */
      if (result && !('statusCode' in result)) {
        /** Extract the forms data array from the result */
        const formsData = result.items || [];
        setReviewsData(formsData as any[]);
      } else {
        /** Handle error case - set empty array or show error message */
        setReviewsData([]);
      }
    };
    fetchReviews();
  }, [product]);

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
        {reviewsData.map((review, index) => (
          <ReviewCard key={index} review={review} index={index} state={state} />
        ))}
      </section>
      {/** View all reviews button with animation support */}
      <ViewAllButton state={state} />
    </>
  );
};

export default ReviewsList;
