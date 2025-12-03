import type { JSX } from 'react';

import { reviewsData } from '@/components/data';

import ReviewCard from './ReviewCard';
import ViewAllButton from './ViewAllButton';

/**
 * ReviewsList component.
 * Displays a list of product reviews with conditional styling based on visibility state.
 * Renders individual ReviewCard components for each review and includes a ViewAllButton.
 * @param   {object}      props       - Component props.
 * @param   {boolean}     props.state - Visibility state that controls the layout spacing and ReviewCard animations.
 * @returns {JSX.Element}             Reviews list section with all reviews and a view all button.
 */
const ReviewsList = ({ state }: { state: boolean }): JSX.Element => {
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
