import type { CombinedState, PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

type InitialStateType = {
  products: (IProductsEntity & { selected: boolean })[];
  currency?: string;
};

const initialState: InitialStateType = {
  products: [],
};
export const cartSlice = createSlice({
  name: 'cart-slice',
  initialState,
  reducers: {
    addProductToCart(
      state,
      action: PayloadAction<IProductsEntity & { selected: boolean }>,
    ) {
      if (
        !action?.payload?.attributeValues?.currency &&
        !action.payload?.price
      ) {
      }
      const index = state.products.findIndex(
        (product) => product.id === action.payload.id,
      );

      if (index !== -1) {
        if (!state.products[index].selected) {
          state.products.push({ ...action.payload, selected: false });
        } else {
          state.products.push(action.payload);
        }
      } else {
        state.products.push(action.payload);
      }

      if (!state?.currency) {
        state.currency = action.payload?.attributeValues?.currency?.value;
      }
    },
    removeProduct(state, action: PayloadAction<number>) {
      state.products = state.products.filter(
        (product: IProductsEntity) => product.id !== action.payload,
      );
    },
    deselectProduct(state, action: PayloadAction<number>) {
      state.products.map((product) => {
        if (product.id === action.payload) {
          product.selected = !product.selected;
        }
      });
    },
    decreaseProduct(state, action: PayloadAction<number>) {
      const badIndex = state.products.findIndex((product: IProductsEntity) => {
        return product.id === action.payload;
      });
      state.products.splice(badIndex, 1);
    },
    removeAllProducts(state) {
      state.products = initialState.products;
    },
  },
});

export const {
  addProductToCart,
  deselectProduct,
  removeProduct,
  decreaseProduct,
  removeAllProducts,
} = cartSlice.actions;

export const selectCartItems = (
  state: CombinedState<{ cartReducer: InitialStateType; favoritesReducer: {} }>,
) => state.cartReducer.products;

export const selectCartItemWithIdLength = (
  state: CombinedState<{ cartReducer: InitialStateType; favoritesReducer: {} }>,
  id: number,
) => state.cartReducer.products.filter((item) => item.id === id)?.length;

export const selectBasketCount = (
  state: CombinedState<{ cartReducer: InitialStateType; favoritesReducer: {} }>,
) => state.cartReducer.products.length;

export const selectBasketTotal = (
  state: CombinedState<{ cartReducer: InitialStateType; favoritesReducer: {} }>,
) =>
  state.cartReducer.products.reduce((total, item) => {
    if (item.selected) {
      total += item.price - (item?.attributeValues?.sale?.value || 0);
    }
    return total;
  }, 0);

export default cartSlice.reducer;
