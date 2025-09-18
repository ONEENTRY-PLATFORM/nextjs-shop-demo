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
        // Add the product to the cart with the specified quantity (minimum 1)
        state.productsData.push({
          id: action.payload.id,
          selected: action.payload.selected,
          quantity: Math.max(1, action.payload.quantity),
        });
      } else {
        // If the product is already in the cart, we increase its quantity
        state.productsData[index] = {
          ...state.productsData[index],
          quantity: Math.max(
            1,
            state.productsData[index].quantity + action.payload.quantity,
          ),
        };
      }
    },
    // Define a function named `addProductsToCart` that takes two parameters
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

      if (index === -1) {
        // If the product is not in the cart, add it with a quantity of 1
        state.productsData.push({
          id: action.payload.id,
          quantity: 1,
          selected: true,
        });
        return;
      }

      const qty = state.productsData[index].quantity + action.payload.quantity;

      // Limit the number to the maximum available
      const clampedQty = Math.min(qty, action.payload.units);

      state.productsData[index] = {
        ...state.productsData[index],
        selected: state.productsData[index].selected,
        quantity: clampedQty,
      };
    },
    decreaseProductQty(
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) {
      const index = state.productsData.findIndex(
        (product: { id: number }) => product.id === action.payload.id,
      );

      if (index === -1) {
        return;
      }

      const qty = state.productsData[index].quantity - action.payload.quantity;

      // If the quantity is less than or equal to 0, remove the item from the cart
      if (qty <= 0) {
        state.productsData = state.productsData.filter(
          (item: IProducts) => item.id !== action.payload.id,
        );
        return;
      }

      state.productsData[index] = {
        ...state.productsData[index],
        selected: state.productsData[index].selected,
        quantity: qty,
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

      // If the quantity is less than or equal to 0, remove the item from the cart
      if (qty <= 0) {
        state.productsData = state.productsData.filter(
          (item: IProducts) => item.id !== action.payload.id,
        );
        return;
      }

      // Limit the number to the maximum available
      const clampedQty = Math.min(qty, action.payload.units);

      if (index !== -1) {
        state.productsData[index] = {
          ...state.productsData[index],
          selected: state.productsData[index].selected,
          quantity: clampedQty,
        };
      } else {
        // If the product is not yet in the cart, add it
        state.productsData.push({
          id: action.payload.id,
          quantity: clampedQty,
          selected: true,
        });
      }
    },
    removeProduct(state, action: PayloadAction<number>) {
      state.productsData = state.productsData.filter(
        (item: IProducts) => item.id !== action.payload,
      );
    },
    deselectProduct(state, action: PayloadAction<number>) {
      state.productsData = state.productsData.map((product) => {
        if (product.id === action.payload) {
          return {
            ...product,
            selected: !product.selected,
          };
        }
        return product;
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

/**
 * selectIsInCart
 *
 * @param state
 * @param id product id
 *
 * @returns
 */
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

/**
 * Select cart data
 *
 * @param state slice state
 *
 * @returns productsData
 */
export const selectCartData = (state: {
  cartReducer: { productsData: IProducts[] };
}) => state.cartReducer.productsData;

/**
 * Select cart items
 *
 * @param state slice state
 *
 * @returns
 */
export const selectCartItems = (state: {
  cartReducer: { products: IProductsEntity[] };
}) => state.cartReducer.products;

/**
 * Select delivery data
 *
 * @param state slice state
 *
 * @returns
 */
export const selectDeliveryData = (state: {
  cartReducer: {
    deliveryData: {
      date: number;
      time: string;
      address: string;
    };
  };
}) => state.cartReducer.deliveryData;

/**
 * Select cart total
 *
 * @param state slice state
 *
 * @returns
 */
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

/**
 * Select cart item by product id
 *
 * @param state slice state
 * @param id product id
 *
 * @returns
 */
export const selectCartItemWithIdLength = (
  state: {
    cartReducer: {
      productsData: IProducts[];
    };
  },
  id: number,
) =>
  state.cartReducer.productsData.find((item: { id: number }) => item.id === id);

/**
 * Get transition - get product id for animations
 *
 * @param state slice state
 *
 * @returns transitionId
 */
export const getTransition = (state: {
  cartReducer: {
    transitionId: number;
  };
}) => state.cartReducer;

/**
 * Select cart version
 *
 * @param state slice state
 *
 * @returns cart version
 */
export const selectCartVersion = (state: {
  favoritesReducer: { version: number };
}) => state.favoritesReducer.version;

export default cartSlice.reducer;
