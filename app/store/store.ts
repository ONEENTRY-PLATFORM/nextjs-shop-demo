'use client';

import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { RTKApi } from '../api';
import cartReducer from './reducers/CartSlice';
import favoritesReducer from './reducers/FavoritesSlice';
import filterReducer from './reducers/FilterSlice';
import signUpReducer from './reducers/SignUpSlice';
import systemContentReducer from './reducers/SystemContentSlice';
// import {orderReducer} from '../modules/orders';

const rootReducer = combineReducers({
  cartReducer,
  favoritesReducer,
  // orderReducer,
  filterReducer,
  systemContentReducer,
  signUpReducer,
  [RTKApi.reducerPath]: RTKApi.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(RTKApi.middleware),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
