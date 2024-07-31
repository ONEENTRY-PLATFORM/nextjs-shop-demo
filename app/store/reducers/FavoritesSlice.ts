import {CombinedState, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';

type InitialStateType = {
  products: IProductsEntity[];
};
const initialState: InitialStateType = {
  products: [],
};

export const favoritesSlice = createSlice({
  name: 'favorites-slice',
  initialState,
  reducers: {
    addFavorites(state, action: PayloadAction<IProductsEntity>) {
      const isUnique = state.products.findIndex((product: IProductsEntity) => {
        return product.id === action.payload.id;
      });
      if (isUnique === -1) {
        state.products.push(action.payload);
      }
    },
    removeFavorites(state, action: PayloadAction<number>) {
      state.products = state.products.filter(
        (product: IProductsEntity) => product.id !== action.payload,
      );
    },
    removeAllFavorites(state) {
      state.products = initialState.products;
    },
  },
});

export const {addFavorites, removeFavorites} = favoritesSlice.actions;

export const selectIsFavorites = (
  state: CombinedState<{cartReducer: {}; favoritesReducer: InitialStateType}>,
  id: number,
): boolean => {
  const added = state.favoritesReducer.products.findIndex(
    product => product.id === id,
  );
  if (added === -1) {
    return false;
  }
  return true;
};

export default favoritesSlice.reducer;
