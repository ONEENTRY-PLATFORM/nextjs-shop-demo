import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

type InitialStateType = {
  products: (IProductsEntity & { selected: boolean } & { quantity: number })[];
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
      state.products[index] = {
        ...state.products[index],
        selected: state.products[index].selected,
        quantity: state.products[index].quantity + action.payload.quantity,
      };
    },
    decreaseProductQty(
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) {
      const index = state.products.findIndex(
        (product: { id: number }) => product.id === action.payload.id,
      );
      state.products[index] = {
        ...state.products[index],
        selected: state.products[index].selected,
        quantity: state.products[index].quantity - action.payload.quantity,
      };
    },
    setProductQty(
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) {
      const index = state.products.findIndex(
        (product: { id: number }) => product.id === action.payload.id,
      );
      state.products[index] = {
        ...state.products[index],
        selected: state.products[index].selected,
        quantity: action.payload.quantity,
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
  },
});

export const {
  addProductToCart,
  deselectProduct,
  removeProduct,
  increaseProductQty,
  decreaseProductQty,
  setProductQty,
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

export const selectCartItemWithIdLength = (
  state: {
    cartReducer: {
      products: [];
    };
  },
  id: number,
) => state.cartReducer.products.find((item: { id: number }) => item.id === id);

export const selectBasketCount = (state: {
  cartReducer: { products: IProductsEntity & { quantity: number }[] };
}) => {
  const totalCount =
    state.cartReducer.products.length > 0
      ? state.cartReducer.products
          .map((item) => {
            return item.quantity;
          })
          .reduce((total, num) => {
            return total + num;
          })
      : 0;
  return totalCount;
};

export const selectCartTotal = (state: { cartReducer: { products: [] } }) =>
  state.cartReducer.products.reduce(
    (
      total: number,
      item: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        selected: any;
        price: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        attributeValues: { sale: { value: any } };
      },
    ) => {
      if (item.selected) {
        total += item.price - (item?.attributeValues?.sale?.value || 0);
      }
      return total;
    },
    0,
  );

export default cartSlice.reducer;
