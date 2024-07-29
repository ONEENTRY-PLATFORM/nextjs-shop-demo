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
      <div className="flex flex-col grow text-base font-bold text-orange-500 uppercase max-md:mt-8 max-md:max-w-full">
        <div className="mb-12">
          <ReviewCard />
        </div>
        <div className="flex flex-col gap-5 max-md:mt-10 max-md:max-w-full">
          {reviewsData.map((review) => (
            <ReviewCard key={review.id} content={review.content} />
          ))}
          <button className="self-end px-16 py-4 mt-5 border border-orange-500 border-solid rounded-[30px] max-md:px-5">
            View all reviews
          </button>
        </div>
      </div>
      <aside className="max-w-full w-[380px] max-md:mt-8">
        <ReviewForm />
      </aside>
    </section>
  );
};

export default ReviewSection;