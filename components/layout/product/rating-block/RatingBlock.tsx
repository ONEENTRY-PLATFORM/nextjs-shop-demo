/* eslint-disable jsdoc/reject-any-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import { type JSX, useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import ReviewAnimations from '../animations/ReviewAnimations';
import RatingRow from './RatingRow';
import StarRating from './StarRating';

export const ratingsData = [
  { value: 87, barValue: 100, starCount: 5 },
  { value: 95, barValue: 80, starCount: 4 },
  { value: 21, barValue: 60, starCount: 3 },
  { value: 2, barValue: 30, starCount: 2 },
  { value: 0, barValue: 0, starCount: 1 },
];

/**
 * Rating block.
 * @param   {object}           props             - Rating block props.
 * @param   {object}           props.totalRating - product rating data.
 * @param   {boolean}          props.state       - animation state
 * @param   {string}           props.lang        - language code
 * @param   {IAttributeValues} props.dict        - dictionary
 * @param   {any}              props.product     - product data
 * @param   {any}              props.reviewsData - reviews data
 * @returns {JSX.Element}                        RatingBlock component.
 */
const RatingBlock = ({
  totalRating,
  state,
  // lang,
  // dict,
  product,
  reviewsData,
}: {
  totalRating: number;
  state: boolean;
  lang: string;
  dict: IAttributeValues;
  product: any;
  reviewsData: any;
}): JSX.Element => {
  /**
   * Get drawer state and control functions from OpenDrawerContext
   * Used to open/close the sign in form drawer
   */
  const { open, setOpen, setComponent, setData } =
    useContext(OpenDrawerContext);

  return (
    <ReviewAnimations
      className="flex max-w-[420px] flex-col px-5 max-md:max-w-full"
      index={4}
      state={state}
    >
      {/** Display overall product rating with star rating and numeric value */}
      <div className="flex items-center gap-2.5 self-start text-3xl font-bold leading-8 text-neutral-600">
        <StarRating rating={totalRating} />
        <div>{totalRating}</div>
      </div>
      {/** Display detailed rating distribution */}
      <div className="mt-6 flex w-full flex-col gap-2">
        {ratingsData.map((rating, index) => (
          <RatingRow key={index} rating={rating} state={state} />
        ))}
      </div>
      {/** Leave review button */}
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          setComponent('ReviewForm');
          setData(product);
        }}
        className="btn btn-o w-full btn-md mt-5 self-end max-md:self-center"
      >
        Leave review
      </button>
    </ReviewAnimations>
  );
};

export default RatingBlock;
