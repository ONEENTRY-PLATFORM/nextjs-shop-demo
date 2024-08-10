import React from 'react';

const ReviewForm: React.FC = () => {
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
      <button
        type="submit"
        className="mt-4 rounded bg-orange-500 px-4 py-2 text-white"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
