import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  IAccountsEntity,
  IAttributesSetsEntity,
  IError,
  IFormsEntity,
  IOrderByMarkerEntity,
  IOrdersEntity,
  IProductsEntity,
  IUserEntity,
} from 'oneentry/types';

import { toLangCode } from '@/app/types/enum';

import { getApi, isError } from './api';

interface AttributeByMarkerProps {
  setMarker: string;
  attributeMarker: string;
  activeLang: string;
}

interface SingleOrderProps {
  marker: string;
  id: number;
  activeLang: string;
}

/** Shape of a `queryFn` result for `fakeBaseQuery<IError>()`. */
type QueryResult<T> = { data: T } | { error: IError };

/**
 * Awaits an SDK call and converts it to RTK Query's `{ data | error }` shape.
 *
 * Replaces the per-endpoint pattern of `handleApiResponse` + manual
 * `(result as IError)?.statusCode` checks. Uses the canonical {@link isError}
 * type guard from `./api`.
 * @param   {Promise} call - Promise returned by any SDK method (`T` is its payload type).
 * @returns {Promise}      Result narrowed for RTK Query (`{ data | error }`).
 */
const toQueryResult = async <T>(
  call: Promise<T | IError>,
): Promise<QueryResult<T>> => {
  try {
    const result = await call;
    if (!result || isError(result)) {
      return {
        error: (result ?? {
          statusCode: 500,
          message: 'Empty response',
        }) as IError,
      };
    }
    return { data: result as T };
  } catch (error) {
    return { error: error as IError };
  }
};

/**
 * Creates basic redux logic.
 *
 * `keepUnusedDataFor` is the retention window after the **last** subscriber
 * unmounts, and RTK Query's default of 60 s is far too short for CMS content
 * that changes on an editor's schedule, not a user's: every remount of a form
 * or a cart re-issues the same request. The global default is raised to 5
 * minutes and each endpoint overrides it by how volatile its data actually is
 * — editorial content long, anything reflecting the user's own session short.
 */
export const RTKApi = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery<IError>(),
  keepUnusedDataFor: 300,
  endpoints: (build) => ({
    /**
     * Get single attribute by marker set.
     * @param setMarker       - Marker of attribute set.
     * @param attributeMarker - Marker of attribute.
     * @returns               Query result with attribute
     */
    getSingleAttributeByMarkerSet: build.query<
      IAttributesSetsEntity,
      AttributeByMarkerProps
    >({
      queryFn: async ({ setMarker, attributeMarker, activeLang }) =>
        toQueryResult<IAttributesSetsEntity>(
          getApi().AttributesSets.getSingleAttributeByMarkerSet(
            setMarker,
            attributeMarker,
            activeLang,
          ),
        ),
      /** An attribute set changes when the CMS schema does — effectively never at runtime. */
      keepUnusedDataFor: 600,
    }),
    /**
     * Get Product By Id.
     * @param id   - Product ID.
     * @param lang - Current language shortcode (converted to SDK langCode).
     * @returns    Query result with product
     */
    getProductById: build.query<IProductsEntity, { id: number; lang: string }>({
      queryFn: async ({ id, lang }) => {
        if (!id) {
          return {
            error: {
              statusCode: 400,
              message: 'Product ID is required',
            } as IError,
          };
        }
        return toQueryResult<IProductsEntity>(
          getApi().Products.getProductById(id, toLangCode(lang)),
        );
      },
      /** Price and stock status move, but not within a single browsing session. */
      keepUnusedDataFor: 300,
    }),
    /**
     * Get Products By Ids.
     *
     * For every id that no longer exists in the CMS the API returns a stub
     * object (`{ productPages, blocks, ... }` without `id`/`attributeValues`)
     * instead of omitting it, so the response is filtered down to real
     * product entities before it reaches consumers (favorites/cart/payment
     * would otherwise render them as empty "ghost" cards).
     * @param items - Array of product IDs as string.
     * @param lang  - Current language shortcode (converted to SDK langCode).
     * @returns     Query result with products (stub entries filtered out)
     */
    getProductsByIds: build.query<
      IProductsEntity[],
      { items: string; lang: string }
    >({
      queryFn: async ({ items, lang }) => {
        if (!items || items.length < 1) {
          return { data: [] };
        }
        const result = await toQueryResult<IProductsEntity[]>(
          getApi().Products.getProductsByIds(items, toLangCode(lang)),
        );
        if ('error' in result) {
          return result;
        }
        /** Keep only entities that are actual products (stubs have no id) */
        return {
          data: result.data.filter(
            (product) => typeof product?.id === 'number',
          ),
        };
      },
      /** Backs cart / favorites / payment, all of which remount constantly. */
      keepUnusedDataFor: 300,
    }),
    /**
     * Get form by marker.
     * @param marker - Marker of form.
     * @param lang   - Language code. Default "en_US"
     * @returns      Query result with form
     */
    getFormByMarker: build.query<
      IFormsEntity,
      { marker: string; lang: string }
    >({
      queryFn: async ({ marker, lang }) =>
        toQueryResult<IFormsEntity>(
          getApi().Forms.getFormByMarker(marker, toLangCode(lang)),
        ),
      /**
       * The heaviest win here: eight forms share this endpoint and each one
       * refetched its field schema on every open at the 60 s default.
       */
      keepUnusedDataFor: 600,
    }),
    /**
     * Getting the data of an authorized user.
     * @param langCode - Required parameter lang code.
     * @returns        Query result with user data
     */
    getMe: build.query<IUserEntity, { langCode: string }>({
      queryFn: async ({ langCode }) => {
        /** Skip request if no refresh token in localStorage */
        const refreshToken =
          typeof window !== 'undefined'
            ? localStorage.getItem('refresh-token')
            : null;
        if (!refreshToken) {
          return {
            error: {
              statusCode: 401,
              message: 'No refresh token',
            } as IError,
          };
        }
        return toQueryResult<IUserEntity>(getApi().Users.getUser(langCode));
      },
      /**
       * Deliberately short: this is the signed-in user's own record, and a
       * stale copy outlives edits made in the profile form.
       */
      keepUnusedDataFor: 60,
    }),
    /**
     * Get all payment accounts as an array.
     * @returns Query result with payment accounts
     */
    getAccounts: build.query<IAccountsEntity[], object>({
      queryFn: async () =>
        toQueryResult<IAccountsEntity[]>(getApi().Payments.getAccounts()),
      /** Payment accounts are project configuration, not per-session data. */
      keepUnusedDataFor: 600,
    }),
    /**
     * Retrieve one order storage object by marker.
     * @param marker - Marker of the order object.
     * @returns      Query result with order storage
     */
    getOrderStorageByMarker: build.query<IOrdersEntity, { marker: string }>({
      queryFn: async ({ marker }) =>
        toQueryResult<IOrdersEntity>(
          getApi().Orders.getOrdersStorageByMarker(marker),
        ),
      /** The storage object is delivery/checkout configuration, not an order. */
      keepUnusedDataFor: 600,
    }),
    /**
     * Getting a single order from the order storage object created by the user.
     * @param id         - ID of the order object.
     * @param marker     - The text identifier of the order storage object.
     * @param activeLang - Optional language field.
     * @returns          Query result with single order
     */
    getSingleOrder: build.query<IOrderByMarkerEntity, SingleOrderProps>({
      queryFn: async ({ id, marker, activeLang }) =>
        toQueryResult<IOrderByMarkerEntity>(
          getApi().Orders.getOrderByMarkerAndId(marker, id, activeLang),
        ),
      /**
       * Kept at the floor on purpose: an order's status changes underneath the
       * user (payment confirmation, fulfilment), so this is the one read that
       * must not survive its own screen.
       */
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  useGetSingleAttributeByMarkerSetQuery,
  useGetFormByMarkerQuery,
  useLazyGetMeQuery,
  useGetAccountsQuery,
  useGetOrderStorageByMarkerQuery,
  useGetSingleOrderQuery,
  useGetProductByIdQuery,
  useGetProductsByIdsQuery,
} = RTKApi;
