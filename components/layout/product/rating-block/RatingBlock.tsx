import Image from 'next/image';
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
    <section className="flex max-w-[420px] flex-col justify-center px-5">
      <header className="flex items-center gap-2.5 self-start text-3xl font-bold leading-8 text-neutral-600">
        <Image
          loading="lazy"
          src=""
          className="my-auto aspect-[5] w-full shrink-0 self-start"
          alt=""
        />
        <h1>4,7</h1>
      </header>
      <div className="mt-6 flex w-full flex-col gap-2">
        {ratings.map((rating, index) => (
          <RatingRow key={index} {...rating} />
        ))}
      </div>
    </section>
  );
};

export default RatingBlock;
