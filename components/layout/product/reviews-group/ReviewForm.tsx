import type { JSX } from 'react';

/**
 * ReviewForm component renders a form that allows users to submit product reviews.
 * The form includes a textarea for writing the review content and a submit button to send it.
 * @returns {JSX.Element} A complete review submission form containing:
 */
const ReviewForm = (): JSX.Element => {
  return (
    <form className="relative box-border flex shrink-0 flex-col">
      <label htmlFor="reviewInput" className="sr-only">
        Write your review
      </label>
      <textarea
        id="reviewInput"
        className="h-32 w-full rounded border border-gray-300 p-2"
        placeholder="Write your review here"
      />
      <button type="submit" className="btn btn-lg btn-primary mt-4">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
