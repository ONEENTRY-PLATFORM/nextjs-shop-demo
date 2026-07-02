import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { IAttributesSetsEntity } from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import type { IAuthProvidersEntity } from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import type { IError } from 'oneentry/dist/base/utils';
import type { IBlockEntity } from 'oneentry/dist/blocks/blocksInterfaces';
import type { IFormsEntity } from 'oneentry/dist/forms/formsInterfaces';
import type {
  IOrderByMarkerEntity,
  IOrdersEntity,
} from 'oneentry/dist/orders/ordersInterfaces';
import type { IPositionBlock } from 'oneentry/dist/pages/pagesInterfaces';
import type {
  IAccountsEntity,
  ISessionEntity,
} from 'oneentry/dist/payments/paymentsInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';

import { toLangCode } from '@/app/types/enum';

import { getApi, isError } from './api';

interface AttributeByMarkerProps {
  setMarker: string;
  attributeMarker: string;
  activeLang: string;
}

interface BlockByMarkerProps {
  marker: string;
  activeLang: string;
}

interface BlocksByPageUrlProps {
  pageUrl: string;
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
 * `(result as IError)?.statusCode` checks. Uses the canonical {@link isError} type guard from `./api`.
 * @template           T
 * @param    {Promise} call - Promise returned by any SDK method.
 * @returns  {Promise}      Result narrowed for RTK Query (`{ data | error }`).
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
 */
export const RTKApi = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery<IError>(),
  endpoints: (build) => ({
    /**
     * Get all blocks by page url.
     * @param pageUrl    - Page URL.
     * @param activeLang - Language code. Default "en_US".
     * @returns          Query result with position blocks
     */
    getBlocksByPageUrl: build.query<IPositionBlock[], BlocksByPageUrlProps>({
      queryFn: async ({ pageUrl, activeLang }) =>
        toQueryResult<IPositionBlock[]>(
          getApi().Pages.getBlocksByPageUrl(pageUrl, activeLang),
        ),
    }),
    /**
     * Get block by Marker.
     * @param marker     - Marker of Block.
     * @param activeLang - Language code. Default "en_US".
     * @returns          Query result with block
     */
    getBlockByMarker: build.query<IBlockEntity, BlockByMarkerProps>({
      queryFn: async ({ marker, activeLang }) =>
        toQueryResult<IBlockEntity>(
          getApi().Blocks.getBlockByMarker(marker, activeLang),
        ),
    }),
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
    }),
    /**
     * Get Product By Id.
     * @param id - Product ID.
     * @returns  Query result with product
     */
    getProductById: build.query<IProductsEntity, { id: number }>({
      queryFn: async ({ id }) => {
        if (!id) {
          return {
            error: {
              statusCode: 400,
              message: 'Product ID is required',
            } as IError,
          };
        }
        return toQueryResult<IProductsEntity>(
          getApi().Products.getProductById(id),
        );
      },
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
     * @returns     Query result with products (stub entries filtered out)
     */
    getProductsByIds: build.query<IProductsEntity[], { items: string }>({
      queryFn: async ({ items }) => {
        if (!items || items.length < 1) {
          return { data: [] };
        }
        const result = await toQueryResult<IProductsEntity[]>(
          getApi().Products.getProductsByIds(items),
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
    }),
    /**
     * Get all auth providers objects.
     * @param langCode - Language code. Default "en_US".
     * @returns        Query result with auth providers
     */
    getAuthProviders: build.query<IAuthProvidersEntity[], string>({
      queryFn: async (langCode) =>
        toQueryResult<IAuthProvidersEntity[]>(
          getApi().AuthProvider.getAuthProviders(langCode),
        ),
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
    }),
    /**
     * Get all payment accounts as an array.
     * @returns Query result with payment accounts
     */
    getAccounts: build.query<IAccountsEntity[], object>({
      queryFn: async () =>
        toQueryResult<IAccountsEntity[]>(getApi().Payments.getAccounts()),
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
    }),
    /**
     * Get a single payment session object by its identifier.
     * @param id - Identifier of the retrieved payment session object.
     * @returns  Query result with payment session
     */
    getPaymentSessionById: build.query<ISessionEntity, { id: number }>({
      queryFn: async ({ id }) =>
        toQueryResult<ISessionEntity>(getApi().Payments.getSessionById(id)),
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
    }),
  }),
});

export const {
  useGetBlockByMarkerQuery,
  useGetBlocksByPageUrlQuery,
  useGetSingleAttributeByMarkerSetQuery,
  useGetFormByMarkerQuery,
  useGetAuthProvidersQuery,
  useLazyGetMeQuery,
  useGetAccountsQuery,
  useGetPaymentSessionByIdQuery,
  useLazyGetPaymentSessionByIdQuery,
  useGetOrderStorageByMarkerQuery,
  useGetSingleOrderQuery,
  useGetProductByIdQuery,
  useGetProductsByIdsQuery,
} = RTKApi;
