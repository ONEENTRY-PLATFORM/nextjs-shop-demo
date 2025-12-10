/* eslint-disable @typescript-eslint/no-explicit-any */
// ReviewModal.tsx
'use client';

import '@/app/styles/slick.css';
import '@/app/styles/slick-theme.css';

import Image from 'next/image';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX, Key } from 'react';
import { useState } from 'react';
import Slider from 'react-slick';

import {
  getProductImageUrl,
  getProductTitle,
} from '@/app/api/hooks/useProductsData';
import CommentForm from '@/components/forms/CommentForm';
import Placeholder from '@/components/shared/Placeholder';

import StarRating from '../rating-block/StarRating';
import ChildReviews from './ChildReviews';
import RatingBlock from './RatingBlock';

/**
 * ReviewModal component.
 * Displays a detailed review in a modal with images, comments, and interactions.
 * @param   {object}           props              - Component props.
 * @param   {IAttributeValues} props.dict         - Dictionary object.
 * @param   {IProductsEntity}  props.product      - Product object entity.
 * @param   {object}           props.review       - Review object entity.
 * @param   {any}              props.allReviews   - All reviews.
 * @param   {any}              props.childReviews - Child reviews.
 * @param   {() => void}       props.onClose      - Function to close the modal.
 * @returns {JSX.Element}                         ReviewModal component.
 */
const ReviewModal = ({
  dict,
  allReviews,
  childReviews,
  product,
  review,
  onClose,
}: {
  dict: IAttributeValues;
  product: IProductsEntity;
  review: any;
  allReviews: any;
  childReviews: any;
  onClose?: () => void;
}): JSX.Element => {
  // Extract data from review
  const formData = review?.formData || [];
  const userName = review?.userIdentifier || 'Anonymous';
  const rating = formData[0]?.value || 5;
  const content = formData[2]?.value || '';
  const reviewDate = review?.time
    ? new Date(review.time).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '11.08.2025';

  // Get product data
  const productImageUrl = getProductImageUrl('pic', product);
  const productTitle = getProductTitle(product);

  // Extract review images from formData
  const reviewImages = formData[1]?.value || [
    {
      downloadLink: 'https://via.placeholder.com/600x600.png?text=Image+1',
    },
  ];
  console.log(reviewImages);
  // State for slider navigation
  const [nav1, setNav1] = useState<Slider | null>(null);
  const [nav2, setNav2] = useState<Slider | null>(null);

  // Prepare images data for carousel
  const imagesData: { original: string }[] = reviewImages
    .filter(
      (img: any) => img && typeof img === 'object' && 'downloadLink' in img,
    )
    .map((img: any) => ({
      original: img.downloadLink,
    }));

  const hasImages = imagesData.length > 0;
  const isGallery = imagesData.length > 1;

  // Recursively count all comments (including nested replies)
  const countAllComments = (reviewId: number): number => {
    // Find direct children
    const directChildren = allReviews.filter(
      (r: any) => r.parentId == reviewId && r.id !== reviewId,
    );

    // Count direct children + their nested children
    return directChildren.reduce((total: number, child: any) => {
      return total + 1 + countAllComments(child.id);
    }, 0);
  };

  const totalComments = countAllComments(review?.id);

  return (
    <div className="inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-white">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="stroke-neutral-600"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col gap-5 p-8">
          {/* Heading */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 flex items-center justify-center overflow-hidden">
              {productImageUrl ? (
                <Image
                  src={productImageUrl}
                  alt={productTitle}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-2xl"></div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-800">
                {productTitle}
              </h2>
            </div>
          </div>

          {/* User Product images and review content */}
          <div className="grid grid-cols-2 max-h-100">
            {/* User images carousel */}
            <div className="flex flex-row max-h-100">
              {hasImages ? (
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
                        <div
                          key={i}
                          className="w-full items-center cursor-pointer"
                        >
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
              )}
            </div>

            {/* Review content */}
            <div className="flex flex-col gap-3.5 px-4 overflow-y-auto max-h-100">
              {/* Review header */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[18px] font-bold text-neutral-800">
                  {userName}
                </h3>
                <StarRating rating={rating} />
              </div>

              {/* Review date */}
              <time className="text-sm text-neutral-500">{reviewDate}</time>

              {/* Review text */}
              <p className="text-neutral-600 leading-relaxed">{content}</p>

              {/* Like/Dislike buttons */}
              <div className="flex self-end">
                <RatingBlock />
              </div>

              {/* Comments section */}
              <div className="">
                <h4 className="mb-4 text-lg font-semibold text-neutral-800">
                  Comments{' '}
                  <span className="text-neutral-400">{totalComments}</span>
                </h4>

                {/* Comment input */}
                <div className="mb-6 flex gap-2">
                  <CommentForm review={review} product={product} />
                </div>

                {/* Display child reviews */}
                <ChildReviews
                  dict={dict}
                  product={product}
                  allReviews={allReviews}
                  childReviews={childReviews}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
