/* eslint-disable @typescript-eslint/no-explicit-any */
// ReviewModal.tsx

import Image from 'next/image';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';
import { useState } from 'react';

import {
  getProductImageUrl,
  getProductTitle,
} from '@/app/api/hooks/useProductsData';
import LikeIcon from '@/components/icons/like';
import Placeholder from '@/components/shared/Placeholder';

import StarRating from '../rating-block/StarRating';

/**
 * ReviewModal component.
 * Displays a detailed review in a modal with images, comments, and interactions.
 * @param   {object}           props         - Component props.
 * @param   {IAttributeValues} props.dict    - Dictionary object.
 * @param   {IProductsEntity}  props.product - Product object entity.
 * @param   {object}           props.review  - Review object entity.
 * @param   {() => void}       props.onClose - Function to close the modal.
 * @returns {JSX.Element}                    ReviewModal component.
 */
const ReviewModal = ({
  product,
  review,
  onClose,
}: {
  dict: IAttributeValues;
  product: IProductsEntity;
  review: any;
  onClose?: () => void;
}): JSX.Element => {
  const [commentText, setCommentText] = useState('');
  const [likes, setLikes] = useState(13);
  const [dislikes, setDislikes] = useState(2);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  // Extract data from review
  const formData = review?.formData || [];
  const userName = review?.userIdentifier || 'Gita';
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
  const productTitle = getProductTitle(product) || 'Product';

  // Mock images - в реальном приложении они должны приходить из formData[3]?.value
  const images = [
    { id: 1, gradient: 'from-pink-400 via-red-400 to-orange-400' },
    { id: 2, gradient: 'from-yellow-400 via-lime-400 to-green-400' },
  ];

  // Mock comments
  const comments = [
    {
      id: 1,
      storeName: 'Balloon Toy Store',
      text: 'Hello! Thank you for your rating! ❤️ We are very glad that you are satisfied with our product! We will continue to try to please you with our products! Have a nice day!',
      likes: 0,
      dislikes: 0,
    },
  ];

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      setLiked(true);
      if (disliked) {
        setDislikes(dislikes - 1);
        setDisliked(false);
      }
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDislikes(dislikes - 1);
      setDisliked(false);
    } else {
      setDislikes(dislikes + 1);
      setDisliked(true);
      if (liked) {
        setLikes(likes - 1);
        setLiked(false);
      }
    }
  };

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
          {/* Left side - Product details */}
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

          {/* Right side - Review details */}
          <div className="flex flex-row">
            {/* User images carousel */}
            <div className="flex flex-row">
              <div className="relative ">
                {productImageUrl ? (
                  <Image
                    src={productImageUrl}
                    alt={productTitle}
                    width={600}
                    height={600}
                    className="w-full object-contain"
                    priority
                  />
                ) : (
                  <Placeholder />
                )}
              </div>
            </div>

            {/* Left side - Review content and images */}
            <div className="flex flex-col gap-3.5 px-4">
              {/* Review header */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[18px] font-bold text-neutral-800">
                  {userName}
                </h3>
                <StarRating rating={rating} />
              </div>
              <time className="text-sm text-neutral-500">{reviewDate}</time>

              {/* Review text */}
              <p className="text-neutral-600 leading-relaxed">{content}</p>

              {/* Review images */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className={`aspect-square rounded-2xl bg-linear-to-br ${image.gradient}`}
                    />
                  ))}
                </div>
              )}

              {/* Like/Dislike buttons */}
              <div className="flex gap-4 text-sm text-slate-400">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 group transition-colors ${
                    liked ? 'text-orange-500' : 'hover:text-orange-500'
                  }`}
                >
                  <div className="size-5">
                    <LikeIcon className={liked ? 'fill-orange-500' : ''} />
                  </div>
                  <span className={liked ? 'text-orange-500' : ''}>
                    {likes}
                  </span>
                </button>
                <button
                  onClick={handleDislike}
                  className={`flex items-center gap-2 group transition-colors ${
                    disliked ? 'text-orange-500' : 'hover:text-orange-500'
                  }`}
                >
                  <div className="size-5">
                    <LikeIcon
                      className={`rotate-180 ${disliked ? 'fill-orange-500' : ''}`}
                    />
                  </div>
                  <span className={disliked ? 'text-orange-500' : ''}>
                    {dislikes}
                  </span>
                </button>
              </div>

              {/* Comments section */}
              <div className="">
                <h4 className="mb-4 text-lg font-semibold text-neutral-800">
                  Comments{' '}
                  <span className="text-neutral-400">{comments.length}</span>
                </h4>

                {/* Comment input */}
                <div className="mb-6 flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Your comment to the review"
                    className="flex-1 rounded-full border border-gray-300 px-6 py-3 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                  />
                  {/* Send comment button */}
                  <button
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 hover:bg-orange-500 hover:text-white transition-colors"
                    aria-label="Send comment"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="stroke-current"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10 3v14M3 10h14" />
                    </svg>
                  </button>
                </div>

                {/* Comments list */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="pl-4 border-l-2 border-orange-500"
                    >
                      <div className="mb-2 flex flex-col items-start gap-3">
                        <div className="flex flex-row gap-4">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-pink-400">
                            <span className="text-xl"></span>
                          </div>
                          <h5 className="font-semibold text-neutral-800">
                            {comment.storeName}
                          </h5>
                        </div>
                        <div className="flex-1">
                          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                            {comment.text}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 text-sm text-slate-400">
                        <button className="flex items-center gap-2 group hover:text-orange-500 transition-colors">
                          <div className="size-5">
                            <LikeIcon />
                          </div>
                          <span>{comment.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 group hover:text-orange-500 transition-colors">
                          <div className="size-5">
                            <LikeIcon className="rotate-180" />
                          </div>
                          <span>{comment.dislikes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
