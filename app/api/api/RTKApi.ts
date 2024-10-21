/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import type { Action, PayloadAction } from '@reduxjs/toolkit';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
// import { HYDRATE } from 'next-redux-wrapper';
import type { IAuthProvidersEntity } from 'oneentry/dist/auth-provider/authProvidersInterfaces';
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
import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';

import { LanguageEnum } from '@/app/types/enum';

import { api } from './api';
import { IError } from 'oneentry/dist/base/utils';

// type RootState = any; // normally inferred from state

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

// function isHydrateAction(action: Action): action is PayloadAction<RootState> {
//   return action.type === HYDRATE;
// }

export const RTKApi = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  // extractRehydrationInfo(action, { reducerPath }): any {
  //   if (isHydrateAction(action)) {
  //     return action.payload[reducerPath];
  //   }
  // },
  endpoints: (build) => ({
    getBlocksByPageUrl: build.query<IPositionBlock[], BlocksByPageUrlProps>({
      queryFn: async ({ pageUrl, activeLang }) => {
        const result = await api.Pages.getBlocksByPageUrl(pageUrl, activeLang);
        if (!result || (result as IError)?.statusCode) {
          return { error: result };
        }
        return { data: result as IPositionBlock[] };
      },
    }),
    getBlockByMarker: build.query<IBlockEntity, BlockByMarkerProps>({
      queryFn: async ({ marker, activeLang }) => {
        const result = await api.Blocks.getBlockByMarker(marker, activeLang);
        if (!result || (result as IError)?.statusCode) {
          return { error: result };
        }
        return { data: result as IBlockEntity };
      },
    }),
    getAuthProviders: build.query<IAuthProvidersEntity[], string>({
      queryFn: async (activeLang) => {
        const result = await api.AuthProvider.getAuthProviders(activeLang);
        if (!result || (result as IError)?.statusCode) {
          return { error: result };
        }
        return { data: result as IAuthProvidersEntity[] };
      },
    }),
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
    getMe: build.query<IUserEntity, { langCode: string }>({
      queryFn: async ({ langCode }) => {
        const result = await api.Users.getUser(langCode);
        if (!result || (result as IError)?.statusCode) {
          return { error: result };
        }
        return { data: result as IUserEntity };
      },
    }),
    getAccounts: build.query<IAccountsEntity[], object>({
      queryFn: async () => {
        const result = await api.Payments.getAccounts();
        if (!result || (result as IError)?.statusCode) {
          return { error: result };
        }
        return { data: result as IAccountsEntity[] };
      },
    }),
    getOrderStorageByMarker: build.query<IOrdersEntity, { marker: string }>({
      queryFn: async ({ marker }) => {
        const result = await api.Orders.getOrderByMarker(marker);
        if (!result || (result as IError)?.statusCode) {
          return { error: result };
        }
        return { data: result as IOrdersEntity };
      },
    }),
    getPaymentSessionById: build.query<ISessionEntity, { id: number }>({
      queryFn: async ({ id }) => {
        const result = await api.Payments.getSessionById(id);
        if (!result || (result as IError)?.statusCode) {
          return { error: result };
        }
        return { data: result as ISessionEntity };
      },
    }),
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
} = RTKApi;
