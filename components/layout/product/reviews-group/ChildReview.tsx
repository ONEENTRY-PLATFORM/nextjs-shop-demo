/* eslint-disable @typescript-eslint/no-explicit-any */
import { type JSX, useState } from 'react';

import CommentForm from '@/components/forms/CommentForm';

/**
 * Child review
 * @param   {object}      props         - Child review props
 * @param   {string}      props.lang    - Current language shortcode
 * @param   {object}      props.product - Product
 * @param   {object}      props.review  - Review
 * @returns {JSX.Element}               Child review
 */
const ChildReview = ({
  lang,
  product,
  review,
}: {
  lang: string;
  product: any;
  review: any;
}): JSX.Element => {
  const [state, setState] = useState(false);

  const childFormData = review.formData;
  const userName = review.userIdentifier;
  const content = childFormData[2]?.value;
  const childDate = review.localizeInfos?.updatedDate
    ? new Date(review.localizeInfos.updatedDate).toLocaleDateString('en-US')
    : '';
  return (
    <div className="flex gap-4 border-l-4 border-orange-500 pl-6">
      <div className="flex flex-col gap-3 flex-1">
        {/** Child review header with name and date */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-neutral-600">{userName}</h3>
          </div>
          {childDate && (
            <time className="text-sm text-neutral-600">{childDate}</time>
          )}
        </div>

        {/** Child review content */}
        <p className="text-sm leading-5 text-neutral-600">{content}</p>

        {/** Child review actions */}
        <div className="flex items-center gap-4">
          {/** Leave answer */}
          <button
            type="button"
            onClick={() => setState(!state)}
            className="text-orange-500 text-sm cursor-pointer hover:underline"
          >
            Leave answer
          </button>

          {/** Like and dislike buttons */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="text-slate-300 hover:text-orange-500 transition-colors"
                aria-label="Like"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9H4C3.46957 9 2.96086 9.21071 2.58579 9.58579C2.21071 9.96086 2 10.4696 2 11V17C2 17.5304 2.21071 18.0391 2.58579 18.4142C2.96086 18.7893 3.46957 19 4 19H6M13 7V4C13 3.46957 12.7893 2.96086 12.4142 2.58579C12.0391 2.21071 11.5304 2 11 2L6 9V19H15.28C15.7623 19.0055 16.2304 18.8364 16.5979 18.524C16.9654 18.2116 17.2077 17.7769 17.28 17.3L18.66 8.3C18.7035 8.01882 18.6842 7.73224 18.6033 7.45859C18.5225 7.18494 18.3821 6.93048 18.1919 6.71337C18.0016 6.49626 17.7661 6.32165 17.5016 6.20096C17.2371 6.08027 16.9499 6.01652 16.66 6.015H13Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span className="text-sm text-slate-300">0</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="text-slate-300 hover:text-orange-500 transition-colors"
                aria-label="Dislike"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 11H16C16.5304 11 17.0391 10.7893 17.4142 10.4142C17.7893 10.0391 18 9.53043 18 9V3C18 2.46957 17.7893 1.96086 17.4142 1.58579C17.0391 1.21071 16.5304 1 16 1H14M7 13V16C7 16.5304 7.21071 17.0391 7.58579 17.4142C7.96086 17.7893 8.46957 18 9 18L14 11V1H4.72C4.2377 0.994514 3.76959 1.16359 3.40209 1.47599C3.03459 1.78839 2.79232 2.2231 2.72 2.7L1.34 11.7C1.29648 11.9812 1.31583 12.2678 1.39667 12.5414C1.47751 12.8151 1.6179 13.0695 1.80812 13.2866C1.99834 13.5037 2.23391 13.6783 2.49843 13.799C2.76295 13.9197 3.05014 13.9835 3.34 13.985H7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span className="text-sm text-slate-300">0</span>
            </div>
          </div>
        </div>

        {/* Comment form */}
        {state && <CommentForm lang={lang} review={review} product={product} />}
      </div>
    </div>
  );
};

export default ChildReview;
