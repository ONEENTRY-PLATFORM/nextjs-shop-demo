/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { type JSX, useContext, useState } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import CommentForm from '@/components/forms/CommentForm';

import RatingBlock from '../LikesBlock';
import AnswerButton from './AnswerButton';
import ChildReviews from './ChildReviews';

/**
 * UserComment component.
 * Displays a single user review with their name, rating, comment, and engagement metrics.
 * @param   {object}           props              - UserCommentProps.
 * @param   {IAttributeValues} props.dict         - Dictionary object.
 * @param   {IProductsEntity}  props.product      - product object entity.
 * @param   {object}           props.review       - review object entity.
 * @param   {Array}            props.childReviews - Array of child review objects.
 * @param   {Array}            props.allReviews   - All reviews for recursive lookup.
 * @returns {JSX.Element}                         UserComment component.
 */
const UserComment = ({
  dict,
  product,
  review,
  childReviews = [],
  allReviews = [],
}: {
  dict: IAttributeValues;
  product: IProductsEntity;
  review: any;
  childReviews?: any[];
  allReviews?: any[];
}): JSX.Element => {
  const { open, setOpen, setComponent, setData } =
    useContext(OpenDrawerContext);
  const [state, setState] = useState(false);
  const formData = review.formData;

  const attachments = formData[1]?.value || [];
  const content = formData[2]?.value;

  /** Filter and prepare images */
  const reviewImages = attachments?.filter(
    (img: any) => img && typeof img === 'object' && 'downloadLink' in img,
  );

  /**
   * Recursively count all comments (including nested replies)
   * @param   {number} reviewId - ID of the review to count
   * @returns {number}          - Total number of comments
   */
  const countAllComments = (reviewId: number): number => {
    /** Find direct children */
    const directChildren = allReviews.filter(
      (r: any) => r.parentId == reviewId && r.id !== reviewId,
    );

    /** Count direct children + their nested children */
    return directChildren.reduce((total: number, child: any) => {
      return total + 1 + countAllComments(child.id);
    }, 0);
  };

  const commentsCount = countAllComments(review?.id);

  return (
    <>
      {/** Review content and engagement metrics */}
      <div className="flex flex-col w-full items-start gap-5 text-sm max-md:max-w-full max-md:flex-wrap">
        {/** User comment text */}
        <p className="flex-auto self-start leading-5 text-neutral-600 max-md:max-w-full">
          {content}
        </p>

        {/* Attachments */}
        {reviewImages.length > 0 && (
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {reviewImages.map((image: any, index: number) => (
              <div
                key={index}
                className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-solid border-gray-300"
                onClick={() => {
                  setOpen(!open);
                  setComponent('ReviewModal');
                  setData({
                    dict,
                    allReviews,
                    childReviews,
                    product,
                    review,
                  });
                }}
              >
                <Image
                  src={image.downloadLink}
                  alt={`Review image ${index + 1}`}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        )}

        {/** Engagement metrics (likes and comments) */}
        <div className="mt-auto flex w-full justify-between gap-2.5 whitespace-nowrap text-slate-300 max-md:w-full">
          <div className="flex gap-2.5">
            <AnswerButton dict={dict} state={state} setState={setState} />
            {commentsCount > 0 && (
              <div className="text-orange-500">
                {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
              </div>
            )}
          </div>
          <RatingBlock />
        </div>
      </div>

      {/* Comment form */}
      {state && <CommentForm review={review} product={product} dict={dict} />}

      {/* Display child reviews */}
      <ChildReviews
        product={product}
        childReviews={childReviews}
        dict={dict}
        allReviews={allReviews}
      />
    </>
  );
};

export default UserComment;
