import {combineReducers, configureStore} from '@reduxjs/toolkit';
import cartReducer from './reducers/CartSlice';
import favoritesReducer from './reducers/FavoritesSlice';
import filterReducer from './reducers/FilterSlice';
import systemContentReducer from './reducers/SystemContentSlice';
import SignUpFieldsReducer from '../modules/forms/reducers/signUpFieldsReducer';
import {RTKApi} from '../api';
import {orderReducer} from '../modules/orders';

const rootReducer = combineReducers({
  cartReducer,
  favoritesReducer,
  orderReducer,
  filterReducer,
  systemContentReducer,
  SignUpFieldsReducer,
  [RTKApi.reducerPath]: RTKApi.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(RTKApi.middleware),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
