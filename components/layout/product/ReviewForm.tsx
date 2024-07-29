import React from 'react';

const ReviewForm: React.FC = () => {
  return (
    <form className="box-border flex relative flex-col shrink-0">
      <label htmlFor="reviewInput" className="sr-only">Write your review</label>
      <textarea
        id="reviewInput"
        className="w-full h-32 p-2 border border-gray-300 rounded"
        placeholder="Write your review here"
      />
      <button type="submit" className="mt-4 px-4 py-2 bg-orange-500 text-white rounded">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;