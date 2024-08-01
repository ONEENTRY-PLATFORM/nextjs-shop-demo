import React from 'react';

import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';

interface ReviewData {
  id: number;
  content: string;
}

const reviewsData: ReviewData[] = [
  { id: 1, content: 'Review 1' },
  { id: 2, content: 'Review 2' },
  { id: 3, content: 'Review 3' },
  { id: 4, content: 'Review 4' },
];

const ReviewSection: React.FC = () => {
  return (
    <section className="flex flex-row gap-5 max-md:max-w-full">
      <div className="flex grow flex-col text-base font-bold uppercase text-orange-500 max-md:mt-8 max-md:max-w-full">
        <div className="mb-12">
          <ReviewCard />
        </div>
        <div className="flex flex-col gap-5 max-md:mt-10 max-md:max-w-full">
          {reviewsData.map((review) => (
            <ReviewCard key={review.id} content={review.content} />
          ))}
          <button
            type="button"
            className="mt-5 self-end rounded-[30px] border border-solid border-orange-500 px-16 py-4 max-md:px-5"
          >
            View all reviews
          </button>
        </div>
      </div>
      <aside className="w-[380px] max-w-full max-md:mt-8">
        <ReviewForm />
      </aside>
    </section>
  );
};

export default ReviewSection;
