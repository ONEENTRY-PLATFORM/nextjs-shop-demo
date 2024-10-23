'use client';

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

type InitialStateType = {
  products: (IProductsEntity & { selected: boolean } & { quantity: number })[];
  currency?: string;
  deliveryData: {
    date: number;
    time: string;
    address: string;
  };
  transitionId: number;
};

const initialState: InitialStateType = {
  products: [],
  deliveryData: {
    date: new Date().getTime(),
    time: '',
    address: '',
  },
  transitionId: 0,
};

export const cartSlice = createSlice({
  name: 'cart-slice',
  initialState,
  reducers: {
    addProductToCart(
      state,
      action: PayloadAction<
        IProductsEntity & { selected: boolean } & { quantity: number }
      >,
    ) {
      const index = state.products.findIndex(
        (product: { id: number }) => product.id === action.payload.id,
      );

      if (index !== -1) {
        if (!state.products[index].selected) {
          state.products.push({
            ...action.payload,
            selected: false,
            quantity: 1,
          });
        } else {
          state.products.push({
            ...action.payload,
            selected: true,
            quantity: 1,
          });
        }
      } else {
        state.products.push(action.payload);
      }

      if (!state?.currency) {
        state.currency = action.payload?.attributeValues?.currency?.value;
      }
    },
    increaseProductQty(
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) {
      const index = state.products.findIndex(
        (product: { id: number }) => product.id === action.payload.id,
      );
      const qty = state.products[index].quantity + action.payload.quantity;
      const units = state.products[index].attributeValues?.units_product.value;

      state.products[index] = {
        ...state.products[index],
        selected: state.products[index].selected,
        quantity: qty > units ? Number(units) : qty,
      };
    },
    decreaseProductQty(
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) {
      const index = state.products.findIndex(
        (product: { id: number }) => product.id === action.payload.id,
      );
      const qty = state.products[index].quantity - action.payload.quantity;
      state.products[index] = {
        ...state.products[index],
        selected: state.products[index].selected,
        quantity: qty <= 0 ? 1 : qty,
      };
    },
    setProductQty(
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) {
      const index = state.products.findIndex(
        (product: { id: number }) => product.id === action.payload.id,
      );
      const qty = action.payload.quantity;
      const units = state.products[index].attributeValues?.units_product.value;
      state.products[index] = {
        ...state.products[index],
        selected: state.products[index].selected,
        quantity: qty <= 0 ? 0 : qty > units ? units : qty,
      };
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
    removeAllProducts(state) {
      state.products = initialState.products;
    },
    setDeliveryData(
      state,
      action: PayloadAction<{ date: number; time: string; address: string }>,
    ) {
      state.deliveryData = {
        date: action.payload.date,
        time: action.payload.time,
        address: action.payload.address,
      };
    },
    setCartTransition(state, action: PayloadAction<{ productId: number }>) {
      state.transitionId = action.payload.productId;
    },
  },
});

export const {
  addProductToCart,
  deselectProduct,
  removeProduct,
  increaseProductQty,
  decreaseProductQty,
  setDeliveryData,
  setProductQty,
  setCartTransition,
  removeAllProducts,
} = cartSlice.actions;

export const selectIsInCart = (
  state: { cartReducer: { products: { id: number }[] } },
  id: number,
): boolean => {
  const added = state.cartReducer.products.findIndex(
    (product: { id: number }) => product.id === id,
  );
  if (added === -1) {
    return false;
  }
  return true;
};

export const selectCartItems = (state: {
  cartReducer: { products: IProductsEntity[] };
}) => state.cartReducer.products;

export const getTransition = (state: {
  cartReducer: {
    transitionId: number;
  };
}) => state.cartReducer;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectDeliveryData = (state: {
  cartReducer: {
    deliveryData: {
      date: number;
      time: string;
      address: string;
    };
  };
}) => state.cartReducer.deliveryData;

export const selectCartItemWithIdLength = (
  state: {
    cartReducer: {
      products: IProductsEntity[];
    };
  },
  id: number,
) => state.cartReducer.products.find((item: { id: number }) => item.id === id);

export default cartSlice.reducer;
