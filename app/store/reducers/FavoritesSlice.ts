import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

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
      console.log('addFavorites');

      const isUnique = state.products.findIndex((product: IProductsEntity) => {
        return product.id === action.payload.id;
      });
      if (isUnique === -1) {
        state.products.push(action.payload);
      }
    },
    removeFavorites(state, action: PayloadAction<number>) {
      console.log('removeFavorites');
      state.products = state.products.filter(
        (product: IProductsEntity) => product.id !== action.payload,
      );
    },
    removeAllFavorites(state) {
      state.products = initialState.products;
    },
  },
});

export const { addFavorites, removeFavorites } = favoritesSlice.actions;

export const selectIsFavorites = (
  state: { favoritesReducer: { products: { id: number }[] } },
  id: number,
): boolean => {
  const added = state.favoritesReducer.products.findIndex(
    (product: { id: number }) => product.id === id,
  );
  if (added === -1) {
    return false;
  }
  return true;
};

export default favoritesSlice.reducer;
