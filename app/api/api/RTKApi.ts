/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import type { Action, PayloadAction } from '@reduxjs/toolkit';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
// import { HYDRATE } from 'next-redux-wrapper';
import type { IAuthProvidersEntity } from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import type { IFormsEntity } from 'oneentry/dist/forms/formsInterfaces';
import type {
  IOrdersByMarkersEntity,
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
    // eslint-disable-next-line prettier/prettier
    getBlocksByPageUrl: build.query<IPositionBlock[], { pageUrl: string; activeLang: string; }>({
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
          console.log(result);
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
    getUserOrders: build.query<IOrdersByMarkersEntity[], { marker: string }>({
      queryFn: async ({ marker }) => {
        try {
          const result = await api.Orders.getAllOrdersByMarker(marker);
          return { data: result };
        } catch (e: any) {
          return { error: e.message };
        }
      },
    }),
    // eslint-disable-next-line prettier/prettier
    getSingleOrder: build.query<IOrdersByMarkersEntity, { marker: string; id: number; activeLang: string }>({
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
  useGetBlocksByPageUrlQuery,
  useGetFormByMarkerQuery,
  useLazyGetFormByMarkerQuery,
  useGetAuthProvidersQuery,
  useLazyGetMeQuery,
  useGetAccountsQuery,
  useGetPaymentSessionByIdQuery,
  useLazyGetPaymentSessionByIdQuery,
  useGetOrderStorageByMarkerQuery,
  useGetUserOrdersQuery,
  useGetSingleOrderQuery,
} = RTKApi;
