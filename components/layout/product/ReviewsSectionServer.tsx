import { unstable_noStore } from 'next/cache';
import type { IAttributeValues, IProductsEntity } from 'oneentry/types';
import type { JSX } from 'react';

import { getApi, isError } from '@/app/api/api/api';
import { getFormByMarker } from '@/app/api/server/forms/getFormByMarker';
import { toLangCode } from '@/app/types/enum';

import ReviewsSection from './ReviewsSection';

/** Marker of the product-reviews form. */
const REVIEWS_FORM_MARKER = 'comment_to_product';

/**
 * Fallback module-config id, used only when the form cannot be read.
 *
 * Was hardcoded as the sole source, which is the failure the CMS makes silent:
 * the write side (`CommentForm`) resolves the id from `moduleFormConfigs`, so
 * once the form is recreated in the admin panel the two drift apart — reviews
 * submit successfully and then never appear.
 */
const FALLBACK_MODULE_CONFIG_ID = 5;

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

  /**
   * Resolve the module-config id from the form itself, matching what the write
   * side does. Cached, so this is not an extra round-trip per request.
   */
  const { form } = await getFormByMarker(REVIEWS_FORM_MARKER, lang);
  const formModuleConfigId =
    form?.moduleFormConfigs?.[0]?.id ?? FALLBACK_MODULE_CONFIG_ID;

  /** Fetch reviews data dynamically on each request */
  const reviewsData = await getApi().FormData.getFormsDataByMarker(
    REVIEWS_FORM_MARKER, // marker - Form marker
    formModuleConfigId, // formModuleConfigId - resolved from the form, not hardcoded
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
