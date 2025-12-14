/* eslint-disable jsdoc/reject-any-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JSX } from 'react';

/**
 * TotalComments
 * @param   {any}         props - props
 * @returns {JSX.Element}       TotalComments
 */
const TotalComments = ({
  allReviews,
  review,
}: {
  allReviews: any;
  review: any;
}): JSX.Element => {
  /**
   * Recursively count all comments (including nested replies)
   * @param   {number} reviewId - The ID of the review to start counting from
   * @returns {number}          The total number of comments
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

  /** totalComments */
  const totalComments = countAllComments(review?.id);

  return (
    <h4 className="mb-4 text-lg font-semibold text-neutral-800">
      Comments <span className="text-neutral-400">{totalComments}</span>
    </h4>
  );
};

export default TotalComments;
