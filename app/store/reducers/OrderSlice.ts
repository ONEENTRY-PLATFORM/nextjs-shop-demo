import type { PayloadAction, WritableDraft } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type {
  IOrderProductData,
  IOrdersFormData,
} from 'oneentry/dist/orders/ordersInterfaces';

/**
 * Defining the application-specific order type.
 * @property {string}                                       [formIdentifier]           - Optional identifier for the form.
 * @property {string}                                       [paymentAccountIdentifier] - Optional identifier for the payment account.
 * @property {Array<IOrdersFormData & { valid?: boolean }>} formData                   - Array of form data with an optional validity flag.
 * @property {Array<IOrderProductData>}                     products                   - Array of order product data.
 */
export type IAppOrder = {
  formIdentifier?: string;
  paymentAccountIdentifier?: string;
  formData: Array<IOrdersFormData & { valid?: boolean }>;
  products: Array<IOrderProductData>;
};

/**
 * Defining the shape of the initial state for the order slice.
 * @property {IAppOrder}                    order          - The current order.
 * @property {string}                       currency       - Optional currency type for the order.
 * @property {Array<{identifier: string;}>} paymentMethods - Optional array of payment methods.
 */
type InitialStateType = {
  order: IAppOrder;
  currency?: string;
  paymentMethods?: Array<{
    identifier: string;
  }>;
};

/**
 * Initial state for the order slice.
 * @property {IAppOrder} order          - The current order.
 * @property {Array}     order.formData - Array of form data.
 * @property {Array}     order.products - Array of products.
 */
const initialState: InitialStateType = {
  order: {
    formData: [],
    products: [],
  },
};

/**
 * Creating a Redux slice for order management.
 * @param name         - Name of the slice.
 * @param initialState - The initial state for the slice.
 * @param reducers     - An object containing the reducer functions for managing the favorites slice.
 */
const orderReducer = createSlice({
  name: 'order',
  initialState,
  reducers: {
    /**
     * Create or update an order.
     * @param {WritableDraft<InitialStateType>} state  - Current state.
     * @param {PayloadAction<string>}           action - Payload with order data.
     */
    create(
      state: WritableDraft<InitialStateType>,
      action: PayloadAction<IAppOrder>,
    ) {
      if (!state.order) {
        /** If no order exists, set the new order */
        state.order = action.payload;
      } else {
        /** Merge the new order data with the existing order */
        state.order = {
          ...action.payload,
          ...state.order,
        };
      }
    },
    /**
     * Remove an order by resetting it to its initial state.
     * @param {WritableDraft<InitialStateType>} state - Current state.
     */
    remove(state: WritableDraft<InitialStateType>) {
      state.order = {
        formData: [], // Reset form data
        products: [], // Reset products
      };
    },
    /**
     * Add or update form data in the order.
     * @param {WritableDraft<InitialStateType>} state  - Current state.
     * @param {PayloadAction<string>}           action - Payload with form data.
     */
    addData(
      state: WritableDraft<InitialStateType>,
      action: PayloadAction<IOrdersFormData & { valid?: boolean }>,
    ) {
      if (!state.order) {
        /** If no order exists, do nothing */
        return;
      }
      const ind = state.order.formData.findIndex(
        (item) => item.marker === action.payload.marker,
      );

      if (ind !== -1) {
        /** Update existing form data */
        state.order.formData[ind] = action.payload;
      } else {
        /** Add new form data */
        state.order.formData.push(action.payload);
      }
    },
    /**
     * Add products to the order
     * @param {WritableDraft<InitialStateType>} state  - Current state
     * @param {PayloadAction<string>}           action - Payload with array of products
     */
    addProducts(
      state: WritableDraft<InitialStateType>,
      action: PayloadAction<IOrderProductData[]>,
    ) {
      if (!state.order) {
        /** If no order exists, do nothing */
        return;
      }
      /** Set the products in the order */
      state.order.products = action.payload;
    },
    /**
     * Add payment methods to the order
     * @param {WritableDraft<InitialStateType>} state  - Current state
     * @param {PayloadAction<string>}           action - Payload with array of payment methods
     */
    addPaymentMethods(
      state: WritableDraft<InitialStateType>,
      action: PayloadAction<
        Array<{
          identifier: string;
        }>
      >,
    ) {
      if (!state.paymentMethods) {
        /** Set the payment methods if they don't exist */
        state.paymentMethods = action.payload;
      }
    },
    /**
     * Set the payment account identifier for the order
     * @param {WritableDraft<InitialStateType>} state  - Current state
     * @param {PayloadAction<string>}           action - Payload with payment method identifier
     */
    addPaymentMethod(
      state: WritableDraft<InitialStateType>,
      action: PayloadAction<string>,
    ) {
      if (!state.order) {
        /** If no order exists, do nothing */
        return;
      }
      /** Set the payment account identifier */
      state.order.paymentAccountIdentifier = action.payload;
    },
    /**
     * Set the currency for the order
     * @param {WritableDraft<InitialStateType>} state  - Current state
     * @param {PayloadAction<string>}           action - Payload with currency
     */
    addOrderCurrency(
      state: WritableDraft<InitialStateType>,
      action: PayloadAction<string>,
    ) {
      if (!state.order) {
        /** If no order exists, do nothing */
        return;
      }
      /** Set the currency */
      state.currency = action.payload;
    },
  },
});

/** Exporting actions generated by createSlice */
export const {
  /** Action to remove an order */
  remove: removeOrder,
  /** Action to create an order */
  create: createOrder,
  /** Action to add or update form data */
  addData,
  /** Action to add products */
  addProducts,
  /** Action to add payment methods */
  addPaymentMethods,
  /** Action to set payment account identifier */
  addPaymentMethod,
  /** Action to set currency */
  addOrderCurrency,
} = orderReducer.actions;

/** Exporting the reducer generated by createSlice */
export default orderReducer.reducer;
