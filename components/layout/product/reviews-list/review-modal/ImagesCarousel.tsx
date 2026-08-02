'use client';

import Image from 'next/image';
import type { Dispatch, JSX, Key, SetStateAction } from 'react';
import Slider from 'react-slick';

import type { ReviewAttachment } from '@/app/utils/getReviewFormData';
import Placeholder from '@/components/shared/Placeholder';

/**
 * ImagesCarousel — the main (large) image slider of the review modal, synced
 * with the thumbnail strip through the shared slider refs.
 * @param   {object}                                  props              - Component props
 * @param   {ReviewAttachment[]}                      props.reviewImages - Review attachments (already narrowed to items with a `downloadLink`)
 * @param   {Slider | null}                           props.nav2         - Thumbnail slider this one follows
 * @param   {Dispatch<SetStateAction<Slider | null>>} props.setNav1      - Publishes this slider so the thumbnails can follow it
 * @returns {JSX.Element}                                                The main image slider, or a placeholder when there are no images
 */
const ImagesCarousel = ({
  reviewImages,
  nav2,
  setNav1,
}: {
  reviewImages: ReviewAttachment[];
  nav2: Slider | null;
  setNav1: Dispatch<SetStateAction<Slider | null>>;
}): JSX.Element => {
  /** Prepare images data for carousel */
  const imagesData: { original: string }[] = reviewImages.map((img) => ({
    original: img.downloadLink,
  }));

  const hasImages = imagesData.length > 0;
  const isGallery = imagesData.length > 1;

  return hasImages ? (
    isGallery ? (
      <div className="relative w-full">
        {/* Main image slider */}
        <Slider asNavFor={nav2 ?? undefined} ref={setNav1}>
          {imagesData.map((image, i: string | Key) => (
            <div key={i} className="w-full items-center">
              <Image
                width={600}
                height={600}
                src={image.original}
                alt={`Review image ${i as string}`}
                className="mx-auto self-center rounded-3xl"
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
