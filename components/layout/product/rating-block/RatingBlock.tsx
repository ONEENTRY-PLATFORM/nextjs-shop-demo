/* eslint-disable jsdoc/reject-any-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import { type JSX, useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import { ratingsData } from '@/components/data';
import { ReviewForm } from '@/components/forms';

import ReviewAnimations from '../animations/ReviewAnimations';
import RatingRow from './RatingRow';
import StarRating from './StarRating';

/**
 * Rating block.
 * @param   {object}           props                           - Rating block props.
 * @param   {object}           props.productRating             - product rating data.
 * @param   {number}           props.productRating.rating      - rating value.
 * @param   {number}           props.productRating.reviewCount - number of reviews
 * @param   {boolean}          props.state                     - animation state
 * @param   {string}           props.lang                      - language code
 * @param   {IAttributeValues} props.dict                      - dictionary
 * @param   {any}              props.product                   - product data
 * @returns {JSX.Element}                                      RatingBlock component.
 */
const RatingBlock = ({
  productRating,
  state,
  lang,
  dict,
  product,
}: {
  productRating: {
    rating: number;
    reviewCount: number;
  };
  state: boolean;
  lang: string;
  dict: IAttributeValues;
  product: any;
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
        <StarRating rating={productRating.rating} />
        <div>{productRating.rating}</div>
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
      {/* Review form */}
      <ReviewForm lang={lang} dict={dict} />
    </ReviewAnimations>
  );
};

export default RatingBlock;
