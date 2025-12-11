/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import type { JSX } from 'react';
import Slider from 'react-slick';

const ReviewImages = ({
  reviewImages,
  nav1,
  setNav2,
}: {
  reviewImages: any;
  nav1: any;
  setNav2: any;
}): JSX.Element => {
  if (reviewImages.length < 1) {
  }
  return (
    <Slider
      asNavFor={nav1 ?? undefined}
      ref={setNav2}
      slidesToShow={3}
      swipeToSlide={true}
      focusOnSelect={true}
      arrows={false}
      className="w-full"
    >
      {reviewImages
        .filter(
          (img: unknown) =>
            img &&
            typeof img === 'object' &&
            img !== null &&
            'downloadLink' in img,
        )
        .map((img: { downloadLink: string }, index: number) => (
          <div
            key={index}
            className="relative w-20 h-20 rounded-lg overflow-hidden"
          >
            <Image
              src={img.downloadLink}
              alt={`Review image ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
    </Slider>
  );
};

export default ReviewImages;
