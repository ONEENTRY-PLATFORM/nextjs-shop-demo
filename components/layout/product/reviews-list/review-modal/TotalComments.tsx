import type { IFormByMarkerDataEntity } from 'oneentry/dist/forms-data/formsDataInterfaces';
import type { JSX } from 'react';

import { countReviewReplies } from '@/app/utils/countReviewReplies';

/**
 * TotalComments — the "Comments N" heading of the review modal.
 * @param   {object}                    props            - Component props
 * @param   {IFormByMarkerDataEntity[]} props.allReviews - Every review of the thread, flat
 * @param   {IFormByMarkerDataEntity}   props.review     - The review whose replies are counted
 * @returns {JSX.Element}                                TotalComments
 */
const TotalComments = ({
  allReviews,
  review,
}: {
  allReviews: IFormByMarkerDataEntity[];
  review: IFormByMarkerDataEntity;
}): JSX.Element => {
  /** Direct plus nested replies of this review */
  const totalComments = countReviewReplies(allReviews, review.id);

  return (
    <h4 className="mb-4 text-lg font-semibold text-neutral-800">
      Comments <span className="text-neutral-400">{totalComments}</span>
    </h4>
  );
};

export default TotalComments;
