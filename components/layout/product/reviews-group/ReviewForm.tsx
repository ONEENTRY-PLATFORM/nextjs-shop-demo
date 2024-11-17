import type { FC } from 'react';

/**
 * Review form
 *
 * @returns ReviewForm
 */
const ReviewForm: FC = () => {
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
