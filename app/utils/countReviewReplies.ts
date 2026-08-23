import type { IFormByMarkerDataEntity } from 'oneentry/types';

/**
 * countReviewReplies — total number of replies under a review, including
 * nested ones.
 *
 * Replies are linked by `parentId`, and the API returns the whole thread flat,
 * so the count walks the list recursively. The `id !== reviewId` guard stops a
 * self-referencing record (seen on malformed data) from recursing forever.
 * @param   {IFormByMarkerDataEntity[]} allReviews - Every review of the thread, flat.
 * @param   {number}                    reviewId   - Id of the review to count replies for.
 * @returns {number}                               Number of direct and nested replies.
 */
export const countReviewReplies = (
  allReviews: IFormByMarkerDataEntity[],
  reviewId: number,
): number => {
  const directChildren = allReviews.filter(
    (review) => review.parentId === reviewId && review.id !== reviewId,
  );

  return directChildren.reduce(
    (total, child) => total + 1 + countReviewReplies(allReviews, child.id),
    0,
  );
};
