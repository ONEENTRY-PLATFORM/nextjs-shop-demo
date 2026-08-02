import Image from 'next/image';
import type { Dispatch, JSX, SetStateAction } from 'react';
import Slider from 'react-slick';

import type { ReviewAttachment } from '@/app/utils/getReviewFormData';

/**
 * ReviewImages — the thumbnail strip of the review modal, synced with the main
 * image slider through the shared slider refs.
 * @param   {object}                                  props              - Component props
 * @param   {ReviewAttachment[]}                      props.reviewImages - Review attachments (already narrowed to items with a `downloadLink`)
 * @param   {Slider | null}                           props.nav1         - Main slider these thumbnails follow
 * @param   {Dispatch<SetStateAction<Slider | null>>} props.setNav2      - Publishes this slider so the main one can follow it
 * @returns {JSX.Element}                                                Thumbnail strip
 */
const ReviewImages = ({
  reviewImages,
  nav1,
  setNav2,
}: {
  reviewImages: ReviewAttachment[];
  nav1: Slider | null;
  setNav2: Dispatch<SetStateAction<Slider | null>>;
}): JSX.Element => {
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
      {reviewImages.map((img, index: number) => (
        <div
          key={index}
          className="relative size-20 overflow-hidden rounded-lg"
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
