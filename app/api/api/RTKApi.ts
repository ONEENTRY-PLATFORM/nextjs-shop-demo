import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
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
import type {
  IProductEntity,
  IProductsEntity,
} from 'oneentry/dist/products/productsInterfaces';
import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';

import { LanguageEnum } from '@/app/types/enum';

import { api } from './api';

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

/**
 * Creates basic redux logic.
 */
export const RTKApi = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    /**
     * Get all blocks by page url.
     *
     * @property {string} pageUrl - Marker of Block.
     * @property {string} activeLang - Language code. Default "en_US".
     */
    getBlocksByPageUrl: build.query<IPositionBlock[], BlocksByPageUrlProps>({
      queryFn: async ({ pageUrl, activeLang }) => {
        const result = await api.Pages.getBlocksByPageUrl(pageUrl, activeLang);
        if (!result || (result as IError)?.statusCode) {
          return { error: result };
        }
        return { data: result as IPositionBlock[] };
      },
    }),
    /**
     * Get Product By Id.
     *
     * @property {string} item - IProductsEntity.
     */
    getProductById: build.query<IProductsEntity, { id: number }>({
      queryFn: async ({ id }) => {
        if (!id) {
          return { error: null };
        }
        const result = await api.Products.getProductById(id);
        if (!result || (result as IError)?.statusCode) {
          return { error: result };
        }
        return { data: result as IProductsEntity };
      },
    }),
    /**
     * Get Products By Ids.
     *
     * @property {string} items - Array of IProductsEntity.
     */
    getProductsByIds: build.query<IProductsEntity[], { items: string }>({
      queryFn: async ({ items }) => {
        if (!items || items.length < 1) {
          return { data: [] };
        }
        const products = await api.Products.getProductsByIds(items);
        if (!products || (products as IError).statusCode >= 400) {
          return { error: 'Data error' };
        } else {
          return { data: products as IProductEntity[] };
        }
      },
    }),
    /**
     * Get block by Marker.
     *
     * @property {string} marker - Marker of Block.
     * @property {string} activeLang - Language code. Default "en_US".
     */
    getBlockByMarker: build.query<IBlockEntity, BlockByMarkerProps>({
      queryFn: async ({ marker, activeLang }) => {
        const result = await api.Blocks.getBlockByMarker(marker, activeLang);
        if (!result || (result as IError)?.statusCode) {
          return { error: result };
        }
        return { data: result as IBlockEntity };
      },
    }),
    /**
     * Get all auth providers objects.
     *
     * @property {string} langCode - Language code. Default "en_US".
     */
    getAuthProviders: build.query<IAuthProvidersEntity[], string>({
      queryFn: async (langCode) => {
        const result = await api.AuthProvider.getAuthProviders(langCode);
        if (!result || (result as IError)?.statusCode) {
          return { error: result };
        }
        return { data: result as IAuthProvidersEntity[] };
      },
    }),
    /**
     * Get form by marker.
     *
     * @property {string} marker - Marker of form.
     * @property {string} lang - Language code. Default "en_US"
     */
    // eslint-disable-next-line prettier/prettier
    getFormByMarker: build.query<IFormsEntity, { marker: string; lang: string }>({
      queryFn: async ({ marker, lang }) => {
        const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
        const result = await api.Forms.getFormByMarker(marker, langCode);
        if (!result || (result as IError)?.statusCode) {
          return { error: result };
        }
        return { data: result as IFormsEntity };
      },
    }),
    /**
     * Getting the data of an authorized user.
     *
     * @property {string} langCode - Required parameter lang code.
     */
    getMe: build.query<IUserEntity, { langCode: string }>({
      queryFn: async ({ langCode }) => {
        const result = await api.Users.getUser(langCode);
        if (!result || (result as IError)?.statusCode) {
          return { error: result };
        }
        return { data: result as IUserEntity };
      },
    }),
    /**
     * Get all payment accounts as an array.
     */
    getAccounts: build.query<IAccountsEntity[], object>({
      queryFn: async () => {
        const result = await api.Payments.getAccounts();
        if (!result || (result as IError)?.statusCode) {
          return { error: result };
        }
        return { data: result as IAccountsEntity[] };
      },
    }),
    /**
     * Retrieve one order storage object by marker.
     *
     * @property {string} marker - Marker of the order object.
     */
    getOrderStorageByMarker: build.query<IOrdersEntity, { marker: string }>({
      queryFn: async ({ marker }) => {
        const result = await api.Orders.getOrderByMarker(marker);
        if (!result || (result as IError)?.statusCode) {
          return { error: result };
        }
        return { data: result as IOrdersEntity };
      },
    }),
    /**
     * Get a single payment session object by its identifier.
     *
     * @property {number} id - Identifier of the retrieved payment session object.
     */
    getPaymentSessionById: build.query<ISessionEntity, { id: number }>({
      queryFn: async ({ id }) => {
        const result = await api.Payments.getSessionById(id);
        if (!result || (result as IError)?.statusCode) {
          return { error: result };
        }
        return { data: result as ISessionEntity };
      },
    }),
    /**
     * Getting a single order from the order storage object created by the user
     *
     * @property {number} id - ID of the order object.
     * @property {string} marker - The text identifier of the order storage object.
     * @property {string} activeLang - Optional language field.
     */
    getSingleOrder: build.query<IOrderByMarkerEntity, SingleOrderProps>({
      queryFn: async ({ id, marker, activeLang }) => {
        const result = await api.Orders.getOrderByMarkerAndId(
          marker,
          id,
          activeLang,
        );
        if (!result || (result as IError)?.statusCode) {
          return { error: result };
        }
        return { data: result as IOrderByMarkerEntity };
      },
    }),
  }),
});

export const {
  useGetBlockByMarkerQuery,
  useGetBlocksByPageUrlQuery,
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
