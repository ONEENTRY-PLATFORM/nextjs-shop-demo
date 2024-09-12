'use client';

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import { RTKApi } from '../api';
import cartSlice from './reducers/CartSlice';
import favoritesSlice from './reducers/FavoritesSlice';
import formFieldsReducer from './reducers/FormFieldsSlice';
import orderReducer from './reducers/OrderSlice';
import systemContentReducer from './reducers/SystemContentSlice';

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: number) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage();

const cartReducer = persistReducer(
  {
    key: 'cart-slice',
    storage: storage,
    version: 1,
    whitelist: ['currency', 'products', 'deliveryData'],
  },
  cartSlice,
);

const favoritesReducer = persistReducer(
  {
    key: 'favorites-slice',
    storage: storage,
    version: 1,
    whitelist: ['products'],
  },
  favoritesSlice,
);

const rootReducer = combineReducers({
  cartReducer,
  favoritesReducer,
  orderReducer,
  systemContentReducer,
  formFieldsReducer,
  [RTKApi.reducerPath]: RTKApi.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(RTKApi.middleware),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
