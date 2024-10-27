import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

type InitialStateType = {
  products: number[];
  version: number;
};
const initialState: InitialStateType = {
  products: [],
  version: Date.now(),
};

export const favoritesSlice = createSlice({
  name: 'favorites-slice',
  initialState,
  reducers: {
    addFavorites(state, action: PayloadAction<number>) {
      const isUnique = state.products.findIndex((product: number) => {
        return product === action.payload;
      });
      if (isUnique === -1) {
        state.products.push(action.payload);
      }
    },
    removeFavorites(state, action: PayloadAction<number>) {
      state.products = state.products.filter(
        (product: number) => product !== action.payload,
      );
    },
    removeAllFavorites(state) {
      state.products = initialState.products;
    },
  },
});

export const { addFavorites, removeFavorites, removeAllFavorites } =
  favoritesSlice.actions;

export const selectFavoritesItems = (state: {
  favoritesReducer: { products: number[] };
}) => state.favoritesReducer.products;

export const selectFavoritesVersion = (state: {
  favoritesReducer: { version: number };
}) => state.favoritesReducer.version;

export const selectIsFavorites = (
  state: { favoritesReducer: { products: number[] } },
  id: number,
): boolean => {
  const added = state.favoritesReducer.products.findIndex(
    (product: number) => product === id,
  );
  if (added === -1) {
    return false;
  }
  return true;
};

export default favoritesSlice.reducer;
