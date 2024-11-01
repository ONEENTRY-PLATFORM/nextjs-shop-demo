import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type {
  IOrderProductData,
  IOrdersFormData,
} from 'oneentry/dist/orders/ordersInterfaces';

export type IAppOrder = {
  formIdentifier?: string;
  paymentAccountIdentifier?: string;
  formData: Array<IOrdersFormData & { valid?: boolean }>;
  products: Array<IOrderProductData>;
};

type InitialStateType = {
  order: IAppOrder;
  currency?: string;
  paymentMethods?: Array<{
    identifier: string;
  }>;
};

const initialState: InitialStateType = {
  order: {
    formData: [],
    products: [],
  },
};

const orderReducer = createSlice({
  initialState,
  name: 'order',
  reducers: {
    create(state, action: PayloadAction<IAppOrder>) {
      if (!state.order) {
        state.order = action.payload;
      }
    },
    remove(state) {
      state.order = {
        formData: [],
        products: [],
      };
    },
    addData(
      state,
      action: PayloadAction<IOrdersFormData & { valid?: boolean }>,
    ) {
      if (!state.order) {
        return;
      }
      const ind = state.order.formData.findIndex(
        (item) => item.marker === action.payload.marker,
      );

      if (ind !== -1) {
        state.order.formData[ind] = action.payload;
      } else {
        state.order.formData.push(action.payload);
      }
    },
    addProducts(state, action: PayloadAction<IOrderProductData[]>) {
      if (!state.order) {
        return;
      }
      state.order.products = action.payload;
    },
    addPaymentMethods(
      state,
      action: PayloadAction<
        Array<{
          identifier: string;
        }>
      >,
    ) {
      if (!state.paymentMethods) {
        state.paymentMethods = action.payload;
      }
    },
    addPaymentMethod(state, action: PayloadAction<string>) {
      if (!state.order) {
        return;
      }
      state.order.paymentAccountIdentifier = action.payload;
    },
    addOrderCurrency(state, action: PayloadAction<string>) {
      if (!state.order) {
        return;
      }
      state.currency = action.payload;
    },
  },
});

export const {
  remove: removeOrder,
  create: createOrder,
  addData,
  addProducts,
  addPaymentMethods,
  addPaymentMethod,
  addOrderCurrency,
} = orderReducer.actions;

export default orderReducer.reducer;
