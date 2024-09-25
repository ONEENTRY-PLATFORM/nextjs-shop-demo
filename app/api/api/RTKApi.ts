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
  // IOrdersByMarkerEntity,
  IOrdersEntity,
} from 'oneentry/dist/orders/ordersInterfaces';
import type { IPositionBlock } from 'oneentry/dist/pages/pagesInterfaces';
import type {
  IAccountsEntity,
  ISessionEntity,
} from 'oneentry/dist/payments/paymentsInterfaces';
import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';

import { api } from './api';

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
        try {
          const result = await api.Pages.getBlocksByPageUrl(
            pageUrl,
            activeLang,
          );
          return { data: result };
        } catch (e: any) {
          return { error: e.message };
        }
      },
    }),
    getBlockByMarker: build.query<IBlockEntity, BlockByMarkerProps>({
      queryFn: async ({ marker, activeLang }) => {
        try {
          const result = await api.Blocks.getBlockByMarker(marker, activeLang);
          return { data: result };
        } catch (e: any) {
          return { error: e.message };
        }
      },
    }),
    getAuthProviders: build.query<IAuthProvidersEntity[], string>({
      queryFn: async (activeLang) => {
        try {
          const result = await api.AuthProvider.getAuthProviders(activeLang);
          return { data: result };
        } catch (e: any) {
          return { error: e.message };
        }
      },
    }),
    getFormByMarker: build.query<IFormsEntity, { marker: string }>({
      queryFn: async ({ marker }) => {
        try {
          const result = await api.Forms.getFormByMarker(marker);
          return { data: result };
        } catch (e: any) {
          return { error: e.message };
        }
      },
    }),
    getMe: build.query<IUserEntity, object>({
      queryFn: async () => {
        try {
          const result = await api.Users.getUser('en_US');
          if (!result) {
            // !!!
            // localStorage.setItem('refresh-token', '');
            return { error: 'getUser error' };
          }
          return { data: result };
        } catch (e: any) {
          return { error: e.message };
        }
      },
    }),
    getAccounts: build.query<IAccountsEntity[], object>({
      queryFn: async () => {
        try {
          const result = await api.Payments.getAccounts();
          return { data: result };
        } catch (e: any) {
          return { error: e.message };
        }
      },
    }),
    getOrderStorageByMarker: build.query<IOrdersEntity, { marker: string }>({
      queryFn: async ({ marker }) => {
        try {
          const result = await api.Orders.getOrderByMarker(marker);
          return { data: result };
        } catch (e: any) {
          return { error: e.message };
        }
      },
    }),
    getPaymentSessionById: build.query<ISessionEntity, { id: number }>({
      queryFn: async ({ id }) => {
        try {
          const result = await api.Payments.getSessionById(id);
          return { data: result };
        } catch (e: any) {
          return { error: e.message };
        }
      },
    }),
    getSingleOrder: build.query<IOrderByMarkerEntity, SingleOrderProps>({
      queryFn: async ({ id, marker, activeLang }) => {
        try {
          const result = await api.Orders.getOrderByMarkerAndId(
            marker,
            id,
            activeLang,
          );
          return { data: result };
        } catch (e: any) {
          return { error: e.message };
        }
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
