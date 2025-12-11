/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { type JSX, type Key, useState } from 'react';
import Slider from 'react-slick';

import Placeholder from '@/components/shared/Placeholder';

const ImagesCarousel = ({
  reviewImages,
}: {
  reviewImages: any;
}): JSX.Element => {
  /** State for slider navigation */
  const [nav1, setNav1] = useState<Slider | null>(null);
  const [nav2, setNav2] = useState<Slider | null>(null);

  /** Prepare images data for carousel */
  const imagesData: { original: string }[] = reviewImages
    .filter(
      (img: any) => img && typeof img === 'object' && 'downloadLink' in img,
    )
    .map((img: any) => ({
      original: img.downloadLink,
    }));

  const hasImages = imagesData.length > 0;
  const isGallery = imagesData.length > 1;

  return hasImages ? (
    isGallery ? (
      <div className="relative w-full">
        {/* Main image slider */}
        <Slider asNavFor={nav2 ?? undefined} ref={setNav1}>
          {imagesData.map((image, i: Key) => (
            <div key={i} className="w-full items-center">
              <Image
                width={600}
                height={600}
                src={image.original}
                alt={`Review image ${i}`}
                className="mx-auto self-center rounded-3xl"
              />
            </div>
          ))}
        </Slider>
        {/* Thumbnail navigation slider */}
        <Slider
          asNavFor={nav1 ?? undefined}
          ref={setNav2}
          slidesToShow={3}
          swipeToSlide={true}
          focusOnSelect={true}
          arrows={false}
        >
          {imagesData.map((image, i: Key) => (
            <div key={i} className="w-full items-center cursor-pointer">
              <Image
                width={150}
                height={150}
                src={image.original}
                alt={`Review thumbnail ${i}`}
                className="mx-auto self-center rounded-xl"
              />
            </div>
          ))}
        </Slider>
      </div>
    ) : (
      <div className="relative w-full">
        <Image
          width={600}
          height={600}
          src={imagesData[0]?.original || ''}
          alt="Review image"
          className="mx-auto self-center rounded-3xl"
        />
      </div>
    )
  ) : (
    <Placeholder />
  );
};

export default ImagesCarousel;
