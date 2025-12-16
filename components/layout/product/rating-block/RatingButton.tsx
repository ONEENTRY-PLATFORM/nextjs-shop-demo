'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { Dispatch, JSX, SetStateAction } from 'react';

import StarRating from './StarRating';

/**
 * RatingButton.
 * @param   {object}                            props              - Props for RatingButton.
 * @param   {IAttributeValues}                  props.dict         - Dictionary
 * @param   {number}                            props.totalRating  - Rating value.
 * @param   {number}                            props.reviewsCount - Review count.
 * @param   {boolean}                           props.state        - State.
 * @param   {Dispatch<SetStateAction<boolean>>} props.setState     - Set state.
 * @returns {JSX.Element}                                          Rating button component.
 */
const RatingButton = ({
  dict,
  totalRating,
  reviewsCount,
  state,
  setState,
}: {
  dict: IAttributeValues;
  totalRating: number;
  reviewsCount: number;
  state: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
}): JSX.Element => {
  const { reviews_title } = dict;

  return (
    <button
      onClick={() => setState(!state)}
      className="group mr-auto flex gap-5"
    >
      {/** Display rating information with stars, numeric rating and review count */}
      <div className="flex gap-2.5">
        <StarRating rating={totalRating} />
        <div className="text-lg font-bold text-neutral-600">
          {totalRating.toFixed(1)}
        </div>
        {/* reviewsCount */}
        <div className="text-sm leading-5 text-slate-300">{reviewsCount}</div>
      </div>

      {/** Display reviews title with collapsible arrow indicator */}
      <div
        className={
          'my-auto cursor-pointer flex items-center gap-3.5 whitespace-nowrap text-lg uppercase text-neutral-600 group-hover:text-orange-500 '
        }
      >
        <div className={state ? 'text-orange-500' : ''}>
          {reviews_title?.value || ''}
        </div>
        <svg
          width="26"
          height="14"
          viewBox="0 0 26 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={
            'group-hover:fill-orange-500 fill-[#4C4D56] transition-transform origin-center ' +
            (state ? 'rotate-180 fill-orange-500' : '')
          }
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.939123 13.6835C0.561619 13.2804 0.58239 12.6476 0.985514 12.2701L13.4156 0.629985L25.8457 12.2701L24.4786 13.7299L13.4156 3.37L2.35258 13.7299C1.94945 14.1074 1.31663 14.0866 0.939123 13.6835Z"
          />
        </svg>
      </div>
    </button>
  );
};

export default RatingButton;
