'use client';

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import type { IProducts } from '@/app/types/global';

type InitialStateType = {
  products: IProductsEntity[];
  productsData: IProducts[];
  currency?: string;
  delivery: IProductsEntity;
  deliveryData: {
    date: number;
    time: string;
    address: string;
  };
  transitionId: number;
  total: number;
  version: number;
};

const initialState: InitialStateType = {
  products: [],
  productsData: [],
  delivery: {} as IProductsEntity,
  deliveryData: {
    date: new Date().getTime(),
    time: '',
    address: '',
  },
  transitionId: 0,
  total: 0,
  version: 0,
};

export const cartSlice = createSlice({
  name: 'cart-slice',
  initialState,
  reducers: {
    addProductToCart(
      state,
      action: PayloadAction<{
        id: number;
        selected: boolean;
        quantity: number;
      }>,
    ) {
      const index = state.productsData.findIndex(
        (product: { id: number }) => product.id === action.payload.id,
      );
      if (index === -1) {
        state.productsData.push(action.payload);
      }
    },
    addProductsToCart(state, action: PayloadAction<IProductsEntity[]>) {
      state.products = action.payload;
    },
    increaseProductQty(
      state,
      action: PayloadAction<{ units: number; id: number; quantity: number }>,
    ) {
      const index = state.productsData.findIndex(
        (product: { id: number }) => product.id === action.payload.id,
      );
      const qty = state.productsData[index].quantity + action.payload.quantity;

      state.productsData[index] = {
        ...state.productsData[index],
        selected: state.productsData[index].selected,
        quantity:
          qty > action.payload.units ? Number(action.payload.units) : qty,
      };
    },
    decreaseProductQty(
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) {
      const index = state.productsData.findIndex(
        (product: { id: number }) => product.id === action.payload.id,
      );
      const qty = state.productsData[index].quantity - action.payload.quantity;
      state.productsData[index] = {
        ...state.productsData[index],
        selected: state.productsData[index].selected,
        quantity: qty <= 0 ? 1 : qty,
      };
    },
    setProductQty(
      state,
      action: PayloadAction<{ units: number; id: number; quantity: number }>,
    ) {
      const index = state.productsData.findIndex(
        (product: { id: number }) => product.id === action.payload.id,
      );
      const qty = action.payload.quantity;

      state.productsData[index] = {
        ...state.productsData[index],
        selected: state.productsData[index].selected,
        quantity:
          qty <= 0
            ? 0
            : qty > action.payload.units
              ? action.payload.units
              : qty,
      };
    },
    removeProduct(state, action: PayloadAction<number>) {
      state.productsData = state.productsData.filter(
        (item: IProducts) => item.id !== action.payload,
      );
    },
    deselectProduct(state, action: PayloadAction<number>) {
      state.productsData.map((product) => {
        if (product.id === action.payload) {
          product.selected = !product.selected;
        }
      });
    },
    removeAllProducts(state) {
      state.productsData = initialState.productsData;
      state.products = initialState.products;
    },
    addDeliveryToCart(state, action: PayloadAction<IProductsEntity>) {
      state.delivery = action.payload;
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
    setCartVersion(state, action: PayloadAction<number>) {
      state.version = action.payload;
    },
  },
});

export const {
  addProductToCart,
  addProductsToCart,
  deselectProduct,
  removeProduct,
  increaseProductQty,
  decreaseProductQty,
  setDeliveryData,
  addDeliveryToCart,
  setProductQty,
  setCartTransition,
  removeAllProducts,
  setCartVersion,
} = cartSlice.actions;

// selectIsInCart
export const selectIsInCart = (
  state: { cartReducer: { productsData: { id: number }[] } },
  id: number,
): boolean => {
  const added = state.cartReducer.productsData.findIndex(
    (product: { id: number }) => product.id === id,
  );
  if (added === -1) {
    return false;
  }
  return true;
};

// selectCartData
export const selectCartData = (state: {
  cartReducer: { productsData: IProducts[] };
}) => state.cartReducer.productsData;

// selectCartItems
export const selectCartItems = (state: {
  cartReducer: { products: IProductsEntity[] };
}) => state.cartReducer.products;

// selectDeliveryData
export const selectDeliveryData = (state: {
  cartReducer: {
    deliveryData: {
      date: number;
      time: string;
      address: string;
    };
  };
}) => state.cartReducer.deliveryData;

// selectDeliveryData
export const selectCartTotal = (state: {
  cartReducer: {
    productsData: IProducts[];
    products: IProductsEntity[];
  };
}) => {
  return state.cartReducer.productsData.reduce((total, product, index) => {
    if (product.selected) {
      const p = state.cartReducer.products[index];
      total += (p?.attributeValues?.sale?.value || p?.price) * product.quantity;
    }
    return total;
  }, 0);
};

// selectCartItemWithIdLength
export const selectCartItemWithIdLength = (
  state: {
    cartReducer: {
      productsData: IProducts[];
    };
  },
  id: number,
) =>
  state.cartReducer.productsData.find((item: { id: number }) => item.id === id);

export const getTransition = (state: {
  cartReducer: {
    transitionId: number;
  };
}) => state.cartReducer;

export const selectCartVersion = (state: {
  favoritesReducer: { version: number };
}) => state.favoritesReducer.version;

export default cartSlice.reducer;
