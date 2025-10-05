import type { JSX } from 'react';
import React from 'react';

import ReviewAnimations from '../animations/ReviewAnimations';

/**
 * ViewAllButton.
 * @param state.state
 * @param state       - Button state.
 * @returns           ViewAll Button.
 */
const ViewAllButton = ({ state }: { state: boolean }): JSX.Element => {
  return (
    <ReviewAnimations
      className="flex flex-col gap-5 max-md:mb-10 max-md:max-w-full"
      index={3}
      state={state}
    >
      <button
        type="button"
        className="btn btn-o btn-md mt-5 self-end max-md:self-center"
      >
        View all reviews
      </button>
    </ReviewAnimations>
  );
};

export default ViewAllButton;
