import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import { RTKApi } from '../api';
import cartSlice from './reducers/CartSlice';
import favoritesSlice from './reducers/FavoritesSlice';
import formFieldsSlice from './reducers/FormFieldsSlice';
import orderSlice from './reducers/OrderSlice';

/**
 * Creates a no-operation storage object for server-side rendering compatibility
 * This storage object implements getItem, setItem and removeItem methods but performs no actual operations
 * It is primarily used to replace browser storage (like localStorage) in server environments
 * @returns {object} An object containing no-operation storage methods
 */
const createNoopStorage = (): {
  getItem: () => Promise<number | null>;
  setItem: (key: string, value: number) => Promise<number>;
  removeItem: () => Promise<void>;
} => {
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

/**
 * Persist cartReducer
 * @see {@link https://github.com/rt2zz/redux-persist?tab=readme-ov-file}
 */
const cartReducer = persistReducer(
  {
    key: 'cart-slice',
    storage: storage,
    version: version,
    whitelist: [
      'productsData',
      'currency',
      'deliveryData',
      'delivery',
      'total',
    ],
  },
  cartSlice,
);

/**
 * Persist favoritesReducer
 * @see {@link https://github.com/rt2zz/redux-persist?tab=readme-ov-file}
 */
const favoritesReducer = persistReducer(
  {
    key: 'favorites-slice',
    storage: storage,
    version: version,
    whitelist: ['products'],
  },
  favoritesSlice,
);

/**
 * Persist formFieldsReducer
 * @see {@link https://github.com/rt2zz/redux-persist?tab=readme-ov-file}
 */
const formFieldsReducer = persistReducer(
  {
    key: 'form-fields',
    storage: storage,
    version: version,
    whitelist: ['fields'],
  },
  formFieldsSlice,
);

/**
 * Persist orderReducer
 * @see {@link https://github.com/rt2zz/redux-persist?tab=readme-ov-file}
 */
const orderReducer = persistReducer(
  {
    key: 'order-slice',
    storage: storage,
    version: version,
    whitelist: ['order'],
  },
  orderSlice,
);

/**
 * Combine reducers
 * @see {@link https://github.com/rt2zz/redux-persist?tab=readme-ov-file}
 */
const rootReducer = combineReducers({
  cartReducer,
  favoritesReducer,
  orderReducer,
  formFieldsReducer,
  [RTKApi.reducerPath]: RTKApi.reducer,
});

/**
 * Setup redux store with persistence - save redux state in storage
 * @returns {ReturnType<typeof configureStore>} Configured store
 * @see {@link https://github.com/rt2zz/redux-persist?tab=readme-ov-file#nested-persists}
 */
export const setupStore = (): ReturnType<typeof configureStore> => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(RTKApi.middleware),
  });
};

/**
 * Root state type
 */
export type RootState = ReturnType<typeof rootReducer>;

/**
 * App store type
 */
export type AppStore = ReturnType<typeof setupStore>;

/**
 * App dispatch type
 */
export type AppDispatch = AppStore['dispatch'];

export const wrapper = createWrapper<AppStore>(setupStore, { debug: false });
