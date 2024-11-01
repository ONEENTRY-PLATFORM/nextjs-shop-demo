import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import { RTKApi } from '../api';
import cartSlice from './reducers/CartSlice';
import favoritesSlice from './reducers/FavoritesSlice';
import formFieldsSlice from './reducers/FormFieldsSlice';
import orderSlice from './reducers/OrderSlice';
import systemContentSlice from './reducers/SystemContentSlice';

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
const version = 1;

const systemContentReducer = persistReducer(
  {
    key: 'system-slice',
    storage: storage,
    version: version,
    whitelist: ['content'],
  },
  systemContentSlice,
);
const cartReducer = persistReducer(
  {
    key: 'cart-slice',
    storage: storage,
    version: version,
    whitelist: ['productsData', 'currency', 'deliveryData'],
  },
  cartSlice,
);
const favoritesReducer = persistReducer(
  {
    key: 'favorites-slice',
    storage: storage,
    version: version,
    whitelist: ['products'],
  },
  favoritesSlice,
);
const formFieldsReducer = persistReducer(
  {
    key: 'form-fields',
    storage: storage,
    version: version,
    whitelist: ['fields'],
  },
  formFieldsSlice,
);
const orderReducer = persistReducer(
  {
    key: 'order-slice',
    storage: storage,
    version: version,
    whitelist: ['products'],
  },
  orderSlice,
);

const rootReducer = combineReducers({
  systemContentReducer,
  cartReducer,
  favoritesReducer,
  orderReducer,
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

export const wrapper = createWrapper<AppStore>(setupStore, { debug: true });
