/* eslint-disable jsdoc/reject-any-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import ChildReviewCard from './ChildReviewCard';

/**
 * Child reviews
 * @param   {object}           props              - Component props
 * @param   {IAttributeValues} props.dict         - Dictionary
 * @param   {IProductsEntity}  props.product      - Product data
 * @param   {any[]}            props.childReviews - Child reviews data
 * @param   {any[]}            props.allReviews   - All reviews data for recursive lookup
 * @returns {JSX.Element}                         ChildReviews
 */
const ChildReviews = ({
  dict,
  product,
  childReviews = [],
  allReviews = [],
}: {
  dict: IAttributeValues;
  product: IProductsEntity;
  childReviews?: any[];
  allReviews?: any[];
}): JSX.Element => {
  /** If there are no child reviews, return an empty fragment */
  if (childReviews.length < 1) {
    return <></>;
  }

  /** If there are child reviews, map through them and return a ChildReview component for each */
  return (
    <div className="mt-5 flex flex-col gap-5">
      {childReviews.map((childReview: any) => (
        <ChildReviewCard
          key={childReview.id}
          product={product}
          review={childReview}
          dict={dict}
          allReviews={allReviews}
        />
      ))}
    </div>
  );
};

export default ChildReviews;
