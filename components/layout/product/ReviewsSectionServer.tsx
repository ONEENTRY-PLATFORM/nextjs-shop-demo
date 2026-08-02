import { unstable_noStore } from 'next/cache';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import { getApi, isError } from '@/app/api';
import { toLangCode } from '@/app/types/enum';

import ReviewsSection from './ReviewsSection';

/**
 * Server wrapper component for ReviewsSection that handles async data fetching without caching.
 * @param   {object}               props         - Component properties
 * @param   {IProductsEntity}      props.product - Product entity object
 * @param   {IAttributeValues}     props.dict    - Dictionary of attribute values from server API
 * @param   {string}               props.lang    - Short route language code (`'en'`, `'fr'`)
 * @returns {Promise<JSX.Element>}               A Promise that resolves to ReviewsSection with fresh data
 */
const ReviewsSectionServer = async ({
  dict,
  product,
  lang,
}: {
  dict: IAttributeValues;
  product: IProductsEntity;
  lang: string;
}): Promise<JSX.Element> => {
  /** Disable caching for this component to ensure fresh review data */
  unstable_noStore();

  /** Fetch reviews data dynamically on each request */
  const reviewsData = await getApi().FormData.getFormsDataByMarker(
    'comment_to_product', // marker - Form marker
    5, // formModuleConfigId - Form module configuration ID
    {
      entityIdentifier: product.id,
      userIdentifier: '',
      status: ['approved'],
      dateFrom: '',
      dateTo: '',
    }, // body - Request body.
    1, // isNested - Flag for getting hierarchical data.
    toLangCode(lang), // langCode - Language code ('en' → 'en_US'; the API returns 0 items for short codes).
    0, // offset — Parameter for pagination. Default: 0.
    500, // limit — Parameter for pagination. Default: 30.
  );

  /**
   * `getFormsDataByMarker` returns an error as a VALUE, not a throw — a closed
   * or misconfigured reviews form must degrade to "no reviews yet" instead of
   * being passed on as review data.
   */
  return (
    <ReviewsSection
      dict={dict}
      reviewsData={isError(reviewsData) ? undefined : reviewsData}
      product={product}
    />
  );
};

export default ReviewsSectionServer;
