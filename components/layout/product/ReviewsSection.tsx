'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';
import { useState } from 'react';

import { productRating } from '@/components/data';
import { ReviewForm } from '@/components/forms';

import RatingBlock from './rating-block/RatingBlock';
import RatingButton from './rating-block/RatingButton';
import ReviewsList from './reviews-group/ReviewsList';

/**
 * ReviewsSection component.
 * Displays the product reviews section including rating summary, toggle button, and review list.
 * This component manages the state for showing/hiding the detailed reviews list.
 * @param   {object}           props         - Component props.
 * @param   {string}           props.lang    - Language code.
 * @param   {IAttributeValues} props.dict    - Dictionary containing localized texts from the server API.
 * @param   {IProductsEntity}  props.product - Product data.
 * @returns {JSX.Element}                    Reviews section component with rating information and reviews list.
 */
const ReviewsSection = ({
  lang,
  dict,
  product,
}: {
  lang: string;
  dict: IAttributeValues;
  product: IProductsEntity;
}): JSX.Element => {
  /** State to control the visibility of the reviews list */
  const [state, setState] = useState(false);

  return (
    <>
      {/* !!! ReviewForm */}
      <ReviewForm lang={lang} dict={dict} product={product} />
      <div className="flex justify-between overflow-hidden max-md:flex-wrap">
        {/** Left column: Rating button and reviews list */}
        <div className="flex flex-col">
          {/** Rating button that toggles the reviews list visibility */}
          <RatingButton
            dict={dict}
            state={state}
            setState={setState}
            {...productRating}
          />
          {/** Reviews list that shows/hides based on state */}
          <ReviewsList state={state} />
        </div>

        {/** Right column: Rating block with detailed rating distribution */}
        <RatingBlock
          productRating={productRating}
          state={state}
          lang={lang}
          dict={dict}
        />
      </div>
    </>
  );
};

export default ReviewsSection;
