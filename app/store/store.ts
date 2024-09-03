'use client';

import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { RTKApi } from '../api';
import cartReducer from './reducers/CartSlice';
import favoritesReducer from './reducers/FavoritesSlice';
import formFieldsReducer from './reducers/FormFieldsSlice';
import orderReducer from './reducers/OrderSlice';
import systemContentReducer from './reducers/SystemContentSlice';

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
      getDefaultMiddleware().concat(RTKApi.middleware),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
