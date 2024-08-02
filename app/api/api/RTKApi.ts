/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
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

export const RTKApi = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    getBlocksByPageUrl: build.query<IPositionBlock[],{ pageUrl: string; activeLang: string }>({
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
    getSingleOrder: build.query<undefined, { id: string }>({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      queryFn: async ({ id }) => {
        try {
          return { data: undefined };
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
} = RTKApi;
