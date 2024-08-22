import React from 'react';

import ReviewCard from './ReviewCard';

const reviews = [
  {
    name: 'Ahmet K.',
    avatarSrc: '',
    content:
      'Lorem ipsum dolor sit amet consectetur. Sit consequat laoreet arcu odio volutpat. Diam eget vitae vulputate integer volutpat nec. Iaculis neque tristique sed id ultrices sed. Pharetra duis eget adipiscing rhoncus diam sagittis turpis ac. Sit consequat quis enim ac platea gravida.',
    likeCount: 17,
    commentCount: 0,
    rating: 5,
  },
  {
    name: 'Ahmet L.',
    avatarSrc: '',
    content:
      'Sit consequat laoreet arcu odio volutpat. Diam eget vitae vulputate integer volutpat nec. Iaculis neque tristique sed id ultrices sed. Pharetra duis eget adipiscing rhoncus diam sagittis turpis ac. Sit consequat quis enim ac platea gravida.',
    likeCount: 7,
    commentCount: 4,
    rating: 3,
  },
  {
    name: 'Ahmet M.',
    avatarSrc: '',
    content:
      'Lorem ipsum dolor sit amet consectetur. Diam eget vitae vulputate integer volutpat nec. Iaculis neque tristique sed id ultrices sed. Pharetra duis eget adipiscing rhoncus diam sagittis turpis ac. Sit consequat quis enim ac platea gravida.',
    likeCount: 17,
    commentCount: 0,
    rating: 2,
  },
  {
    name: 'Ahmet N.',
    avatarSrc: '',
    content:
      'Lorem ipsum dolor. Diam eget vitae vulputate integer volutpat nec. Iaculis neque tristique sed id ultrices sed. Pharetra duis eget adipiscing rhoncus diam sagittis turpis ac. Sit consequat quis enim ac platea gravida.',
    likeCount: 32,
    commentCount: 2,
    rating: 4,
  },
];

const ReviewList: React.FC = () => {
  return (
    <section className="flex flex-col gap-5 max-md:mt-10 max-md:max-w-full">
      {reviews.map((review, index) => (
        <ReviewCard key={index} review={review} />
      ))}
    </section>
  );
};

export default ReviewList;
