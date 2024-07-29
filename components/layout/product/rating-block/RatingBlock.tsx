import React from 'react';
import RatingRow from './RatingRow';

const RatingBlock: React.FC = () => {
  const ratings = [
    { value: 87, barValue: 100, starCount: 5 },
    { value: 95, barValue: 80, starCount: 4 },
    { value: 21, barValue: 60, starCount: 3 },
    { value: 2, barValue: 30, starCount: 2 },
    { value: 0, barValue: 0, starCount: 1 },
  ];

  return (
    <section className="flex flex-col justify-center px-5 max-w-[420px]">
      <header className="flex gap-2.5 items-center self-start text-3xl font-bold leading-8 text-neutral-600">
        <img loading="lazy" src="" className="shrink-0 self-start my-auto w-full aspect-[5]" alt="" />
        <h1>4,7</h1>
      </header>
      <div className="flex flex-col gap-2 mt-6 w-full">
        {ratings.map((rating, index) => (
          <RatingRow key={index} {...rating} />
        ))}
      </div>
    </section>
  );
};

export default RatingBlock;