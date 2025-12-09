/* eslint-disable jsdoc/reject-any-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import ChildReview from './ChildReviewCard';

/**
 * Child reviews
 * @param   {object}           props              - Component props
 * @param   {IAttributeValues} props.dict         - Dictionary
 * @param   {IProductsEntity}  props.product      - Product data
 * @param   {any[]}            props.childReviews - Child reviews data
 * @returns {JSX.Element}                         ChildReviews
 */
const ChildReviews = ({
  dict,
  product,
  childReviews = [],
}: {
  dict: IAttributeValues;
  product: IProductsEntity;
  childReviews?: any[];
}): JSX.Element => {
  /** If there are no child reviews, return an empty fragment */
  if (childReviews.length < 1) {
    return <></>;
  }

  /** If there are child reviews, map through them and return a ChildReview component for each */
  return (
    <div className="mt-5 flex flex-col gap-5">
      {childReviews.map((childReview: any) => (
        <ChildReview
          key={childReview.id}
          product={product}
          review={childReview}
          dict={dict}
        />
      ))}
    </div>
  );
};

export default ChildReviews;
