'use client';

import type { PayloadAction, WritableDraft } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import type { CartLedger } from '@/app/store/utils/ledger';
import { cartActiveProducts } from '@/app/store/utils/ledger';
import type { IProducts } from '@/app/types/global';

/**
 * Defining the shape of the initial state for the cart slice
 * @property {IProductsEntity[]} products     - Array of product entities.
 * @property {IProducts[]}       productsData - Array of product data with additional properties like quantity.
 * @property {CartLedger}        meta         - Tombstone ledger (id → last mutation) used to merge with the server without resurrecting deletions.
 * @property {string}            [currency]   - Currency type.
 * @property {IProductsEntity}   delivery     - Delivery product entity.
 * @property {object}            deliveryData - Details about delivery.
 * @property {number}            transitionId - ID used for transitions/animations.
 * @property {number}            total        - Total cost of items in the cart.
 * @property {number}            version      - Version of the cart, useful for updates.
 */
type InitialStateType = {
  products: IProductsEntity[];
  productsData: IProducts[];
  meta: CartLedger;
  currency?: string;
  delivery: IProductsEntity;
  deliveryData: {
    date: number;
    time: string;
    address: string;
    interval?: Date[];
  };
  transitionId: number;
  total: number;
  version: number;
};

/**
 * Initial state setup for the cart slice.
 * @property {Array}      products     - Array of product entities.
 * @property {Array}      productsData - Array of product data with additional properties like quantity.
 * @property {CartLedger} meta         - Tombstone ledger (empty by default).
 * @property {object}     delivery     - Delivery product entity.
 * @property {object}     deliveryData - Details about delivery.
 * @property {number}     transitionId - ID used for transitions/animations.
 * @property {number}     total        - Total cost of items in the cart.
 * @property {number}     version      - Version of the cart, useful for updates.
 */
const initialState: InitialStateType = {
  products: [],
  productsData: [],
  meta: {},
  delivery: {} as IProductsEntity,
  deliveryData: {
    date: new Date().getTime(),
    time: '',
    address: '',
    interval: [],
  },
  transitionId: 0,
  total: 0,
  version: 0,
};

/**
 * Record a cart mutation in the tombstone ledger.
 *
 * For an active line it snapshots the current `productsData` entry (so the
 * merged cart can be rebuilt from the ledger alone); for a removal it leaves a
 * tombstone with the removal timestamp so the deletion wins a later merge.
 * @param {WritableDraft<InitialStateType>} state   - Current draft state.
 * @param {number}                          id      - Affected product id.
 * @param {number}                          ts      - Mutation timestamp (ms).
 * @param {boolean}                         removed - Whether the line was removed.
 */
const touchCart = (
  state: WritableDraft<InitialStateType>,
  id: number,
  ts: number,
  removed: boolean,
): void => {
  if (removed) {
    state.meta[id] = { ts, removed: true };
    return;
  }
  const product = state.productsData.find((p) => p.id === id);
  if (product) {
    state.meta[id] = { ts, removed: false, product: { ...product } };
  }
};

/**
 * Creating a Redux slice for cart management.
 * @param {string}  name         - Name of the slice.
 * @param {unknown} initialState - Initial state for the cart slice.
 * @param {unknown} reducers     - Reducers for the cart slice.
 */
export const cartSlice = createSlice({
  name: 'cart-slice', // Name of the slice
  initialState, // Initial state defined above
  reducers: {
    /**
     * Add a product to the cart. The timestamp is injected by `prepare` so the
     * reducer stays pure while enabling last-write-wins merges with the server.
     */
    addProductToCart: {
      reducer(
        state: WritableDraft<InitialStateType>,
        action: PayloadAction<{
          id: number;
          selected: boolean;
          quantity: number;
          ts: number;
        }>,
      ) {
        /** This function checks if the product is already in the cart */
        const index = state.productsData.findIndex(
          (product: { id: number }) => product.id === action.payload.id,
        );

        /** If the product is not in the cart, we add it */
        if (index === -1) {
          /** Add the product to the cart with the specified quantity (minimum 1) */
          state.productsData.push({
            id: action.payload.id,
            selected: action.payload.selected,
            quantity: Math.max(1, action.payload.quantity),
          });
        } else {
          /** If the product is already in the cart, we increase its quantity */
          state.productsData[index] = {
            id: state.productsData[index]?.id || action.payload.id,
            selected: state.productsData[index]?.selected ?? true,
            quantity: Math.max(
              1,
              (state.productsData[index]?.quantity || 0) +
                action.payload.quantity,
            ),
          };
        }
        touchCart(state, action.payload.id, action.payload.ts, false);
      },
      prepare(input: { id: number; selected: boolean; quantity: number }) {
        return { payload: { ...input, ts: Date.now() } };
      },
    },
    /**
     * Add multiple products to the cart
     * @param {WritableDraft<InitialStateType>} state  - Current state
     * @param {PayloadAction<string>}           action - Payload with array of product entities
     */
    addProductsToCart(
      state: WritableDraft<InitialStateType>,
      action: PayloadAction<IProductsEntity[]>,
    ) {
      state.products = action.payload;
    },
    /**
     * Increase the quantity of a product in the cart.
     */
    increaseProductQty: {
      reducer(
        state: WritableDraft<InitialStateType>,
        action: PayloadAction<{
          units: number;
          id: number;
          quantity: number;
          ts: number;
        }>,
      ) {
        const index = state.productsData.findIndex(
          (product: { id: number }) => product.id === action.payload.id,
        );

        if (index === -1) {
          /** If the product is not in the cart, add it with a quantity of 1 */
          state.productsData.push({
            id: action.payload.id,
            quantity: 1,
            selected: true,
          });
          touchCart(state, action.payload.id, action.payload.ts, false);
          return;
        }

        const qty =
          (state.productsData[index]?.quantity || 0) + action.payload.quantity;

        /** Limit the number to the maximum available */
        const clampedQty = Math.min(qty, action.payload.units);

        state.productsData[index] = {
          id: state.productsData[index]?.id || action.payload.id,
          selected: state.productsData[index]?.selected || true,
          quantity: clampedQty,
        };
        touchCart(state, action.payload.id, action.payload.ts, false);
      },
      prepare(input: { units: number; id: number; quantity: number }) {
        return { payload: { ...input, ts: Date.now() } };
      },
    },
    /**
     * Decrease the quantity of a product in the cart.
     */
    decreaseProductQty: {
      reducer(
        state: WritableDraft<InitialStateType>,
        action: PayloadAction<{ id: number; quantity: number; ts: number }>,
      ) {
        const index = state.productsData.findIndex(
          (product: { id: number }) => product.id === action.payload.id,
        );

        if (index === -1) {
          return;
        }

        const qty =
          (state.productsData[index]?.quantity || 0) - action.payload.quantity;

        /** If the quantity is less than or equal to 0, remove the item from the cart */
        if (qty <= 0) {
          state.productsData = state.productsData.filter(
            (item: IProducts) => item.id !== action.payload.id,
          );
          touchCart(state, action.payload.id, action.payload.ts, true);
          return;
        }

        state.productsData[index] = {
          id: state.productsData[index]?.id || action.payload.id,
          selected: state.productsData[index]?.selected ?? true,
          quantity: qty,
        };
        touchCart(state, action.payload.id, action.payload.ts, false);
      },
      prepare(input: { id: number; quantity: number }) {
        return { payload: { ...input, ts: Date.now() } };
      },
    },
    /**
     * Set the quantity of a product in the cart.
     */
    setProductQty: {
      reducer(
        state: WritableDraft<InitialStateType>,
        action: PayloadAction<{
          units: number;
          id: number;
          quantity: number;
          ts: number;
        }>,
      ) {
        const index = state.productsData.findIndex(
          (product: { id: number }) => product.id === action.payload.id,
        );

        const qty = action.payload.quantity;

        /** If the quantity is less than or equal to 0, remove the item from the cart */
        if (qty <= 0) {
          state.productsData = state.productsData.filter(
            (item: IProducts) => item.id !== action.payload.id,
          );
          touchCart(state, action.payload.id, action.payload.ts, true);
          return;
        }

        /** Limit the number to the maximum available */
        const clampedQty = Math.min(qty, action.payload.units);

        if (index !== -1) {
          state.productsData[index] = {
            id: state.productsData[index]?.id || action.payload.id,
            selected: state.productsData[index]?.selected ?? true,
            quantity: clampedQty,
          };
        } else {
          /** If the product is not yet in the cart, add it */
          state.productsData.push({
            id: action.payload.id,
            quantity: clampedQty,
            selected: true,
          });
        }
        touchCart(state, action.payload.id, action.payload.ts, false);
      },
      prepare(input: { units: number; id: number; quantity: number }) {
        return { payload: { ...input, ts: Date.now() } };
      },
    },
    /**
     * Remove a product from the cart, leaving a tombstone in the ledger so the
     * removal is propagated to the server instead of resurrecting on merge.
     */
    removeProduct: {
      reducer(
        state: WritableDraft<InitialStateType>,
        action: PayloadAction<{ id: number; ts: number }>,
      ) {
        state.productsData = state.productsData.filter(
          (item: IProducts) => item.id !== action.payload.id,
        );
        touchCart(state, action.payload.id, action.payload.ts, true);
      },
      prepare(id: number) {
        return { payload: { id, ts: Date.now() } };
      },
    },
    /**
     * Toggle the selection status of a product in the cart.
     */
    deselectProduct: {
      reducer(
        state: WritableDraft<InitialStateType>,
        action: PayloadAction<{ id: number; ts: number }>,
      ) {
        state.productsData = state.productsData.map((product) => {
          if (product.id === action.payload.id) {
            return {
              ...product,
              selected: !product.selected,
            };
          }
          return product;
        });
        touchCart(state, action.payload.id, action.payload.ts, false);
      },
      prepare(id: number) {
        return { payload: { id, ts: Date.now() } };
      },
    },
    /**
     * Remove all products from the cart, tombstoning each line so the clear is
     * propagated to the server.
     */
    removeAllProducts: {
      reducer(
        state: WritableDraft<InitialStateType>,
        action: PayloadAction<{ ts: number }>,
      ) {
        for (const item of state.productsData) {
          state.meta[item.id] = { ts: action.payload.ts, removed: true };
        }
        state.productsData = initialState.productsData;
        state.products = initialState.products;
      },
      prepare() {
        return { payload: { ts: Date.now() } };
      },
    },
    /**
     * Replace the ledger with a merged one (server + local) and recompute the
     * active cart from it. Dispatched once per session after authentication.
     * @param {WritableDraft<InitialStateType>} state  - Current state
     * @param {PayloadAction<CartLedger>}       action - Payload with the merged ledger
     */
    mergeCart(
      state: WritableDraft<InitialStateType>,
      action: PayloadAction<CartLedger>,
    ) {
      state.meta = action.payload;
      state.productsData = cartActiveProducts(action.payload);
    },
    /**
     * Add delivery information to the cart
     * @param {WritableDraft<InitialStateType>} state  - Current state
     * @param {PayloadAction<string>}           action - Payload with delivery entity
     */
    addDeliveryToCart(
      state: WritableDraft<InitialStateType>,
      action: PayloadAction<IProductsEntity>,
    ) {
      state.delivery = action.payload;
    },
    /**
     * Set delivery data
     * @param {WritableDraft<InitialStateType>} state  - Current state
     * @param {PayloadAction<string>}           action - Payload with delivery data
     */
    setDeliveryData(
      state: WritableDraft<InitialStateType>,
      action: PayloadAction<{
        date: number;
        time: string;
        address: string;
        interval?: Date[] | undefined;
      }>,
    ) {
      state.deliveryData.date = action.payload.date;
      state.deliveryData.time = action.payload.time;
      state.deliveryData.address = action.payload.address;
      if (action.payload.interval !== undefined) {
        state.deliveryData.interval = action.payload.interval;
      }
    },
    /**
     * Set the transition ID for animations
     * @param {WritableDraft<InitialStateType>} state  - Current state
     * @param {PayloadAction<string>}           action - Payload with product ID
     */
    setCartTransition(
      state: WritableDraft<InitialStateType>,
      action: PayloadAction<{ productId: number }>,
    ) {
      state.transitionId = action.payload.productId;
    },
    /**
     * Set the cart version
     * @param {WritableDraft<InitialStateType>} state  - Current state
     * @param {PayloadAction<string>}           action - Payload with version number
     */
    setCartVersion(
      state: WritableDraft<InitialStateType>,
      action: PayloadAction<number>,
    ) {
      state.version = action.payload;
    },
  },
});

/**
 * Select cart version.
 * @param   {object} state                     - The current state of the Redux store.
 * @param   {object} state.cartReducer         - The cart reducer state.
 * @param   {number} state.cartReducer.version - Cart version number.
 * @returns {number}                           Cart version number.
 */
export const selectCartVersion = (state: {
  cartReducer: { version: number };
}): number => state.cartReducer.version;

/**
 * Select the cart tombstone ledger.
 * @param   {object}     state                  - The current state of the Redux store.
 * @param   {object}     state.cartReducer      - Cart reducer state.
 * @param   {CartLedger} state.cartReducer.meta - The cart ledger.
 * @returns {CartLedger}                        The cart tombstone ledger.
 */
export const selectCartMeta = (state: {
  cartReducer: { meta: CartLedger };
}): CartLedger => state.cartReducer.meta;

/**
 * Get cart transition.
 * @param   {object}  state                          - The current state of the Redux store.
 * @param   {object}  state.cartReducer              - The cart reducer state.
 * @param   {number}  state.cartReducer.transitionId - Cart transition ID.
 * @returns {unknown}                                Object containing transitionId.
 */
export const getTransition = createSelector(
  (state: { cartReducer: { transitionId: number } }) =>
    state.cartReducer.transitionId,
  (transitionId) => ({ transitionId }),
);

/**
 * Select cart data.
 * @param   {object}      state                          - The current state of the Redux store.
 * @param   {object}      state.cartReducer              - Cart reducer state.
 * @param   {IProducts[]} state.cartReducer.productsData - Cart products data.
 * @returns {IProducts[]}                                Cart products data.
 */
export const selectCartData = (state: {
  cartReducer: { productsData: IProducts[] };
}): IProducts[] => state.cartReducer.productsData;

/**
 * Select if product is in cart.
 * @param   {object}      state                          - The current state of the Redux store.
 * @param   {object}      state.cartReducer              - Cart reducer state.
 * @param   {IProducts[]} state.cartReducer.productsData - Cart products data.
 * @param   {number}      productId                      - The ID of the product to check.
 * @returns {boolean}                                    Boolean indicating if product is in cart.
 */
export const selectIsInCart = (
  state: {
    cartReducer: { productsData: IProducts[] };
  },
  productId: number,
): boolean =>
  state.cartReducer.productsData.some(
    (product: IProducts) => product.id === productId,
  );

/**
 * Select delivery data.
 * @param   {object} state                                   - The current state of the Redux store.
 * @param   {object} state.cartReducer                       - Cart reducer state.
 * @param   {object} state.cartReducer.deliveryData          - Delivery data object.
 * @param   {number} state.cartReducer.deliveryData.date     - Delivery date.
 * @param   {string} state.cartReducer.deliveryData.time     - Delivery time.
 * @param   {string} state.cartReducer.deliveryData.address  - Delivery address.
 * @param   {Date[]} state.cartReducer.deliveryData.interval - Delivery time interval.
 * @returns {object}                                         Delivery data object containing date, time, address and interval.
 */
export const selectDeliveryData = (state: {
  cartReducer: {
    deliveryData: {
      date: number;
      time: string;
      address: string;
      interval?: Date[];
    };
  };
}): {
  date: number;
  time: string;
  address: string;
  interval?: Date[] | undefined;
} => state.cartReducer.deliveryData;

/**
 * Select cart total.
 * Uses createSelector + Map for O(n) lookup instead of O(n²) find().
 * @param   {object}            state                          - The current state of the Redux store.
 * @param   {object}            state.cartReducer              - Cart reducer state.
 * @param   {IProducts[]}       state.cartReducer.productsData - Cart products data.
 * @param   {IProductsEntity[]} state.cartReducer.products     - Cart products.
 * @returns {number}                                           Total cost of selected products in the cart.
 */
export const selectCartTotal = createSelector(
  (state: { cartReducer: { productsData: IProducts[] } }) =>
    state.cartReducer.productsData,
  (state: { cartReducer: { products: IProductsEntity[] } }) =>
    state.cartReducer.products,
  (productsData, products) => {
    /** Build O(1) lookup map once per selector invocation */
    const productMap = new Map<number, IProductsEntity>(
      products.map((p) => [p.id, p]),
    );

    return productsData.reduce((total, product) => {
      if (!product.selected) {
        return total;
      }

      const p = productMap.get(product.id);

      /** Check if product is in stock */
      const isInStock =
        p?.statusIdentifier === 'in_stock' &&
        ((p?.attributeValues?.units_product?.value as number | undefined) ??
          0) >= 1;

      /** Only add to total if product is in stock */
      if (isInStock) {
        const price = p
          ? (p.attributeValues?.sale?.value as number | undefined) ||
            (p.attributeValues?.price?.value as number | undefined) ||
            p.price ||
            0
          : 0;
        return total + (price as number) * product.quantity;
      }

      return total;
    }, 0);
  },
);

/**
 * Select cart items.
 * @param   {object}            state                      - The current state of the Redux store.
 * @param   {object}            state.cartReducer          - Cart reducer state.
 * @param   {IProductsEntity[]} state.cartReducer.products - Cart products.
 * @returns {IProductsEntity[]}                            Cart products.
 */
export const selectCartItems = (state: {
  cartReducer: { products: IProductsEntity[] };
}): IProductsEntity[] => state.cartReducer.products;

/**
 * Select cart item by ID length.
 * @param   {object}      state                          - The current state of the Redux store.
 * @param   {object}      state.cartReducer              - Cart reducer state.
 * @param   {IProducts[]} state.cartReducer.productsData - Cart products data.
 * @param   {number}      id                             - The ID of the product to check.
 * @returns {number}                                     Quantity of the product in the cart.
 */
export const selectCartItemWithIdLength = (
  state: {
    cartReducer: { productsData: IProducts[] };
  },
  id: number,
): number => {
  const product = state.cartReducer.productsData.find(
    (product: IProducts) => product.id === id,
  );
  return product ? product.quantity : 0;
};

/** Export actions from the cart slice */
export const {
  addProductToCart,
  addProductsToCart,
  increaseProductQty,
  decreaseProductQty,
  setProductQty,
  removeProduct,
  deselectProduct,
  removeAllProducts,
  mergeCart,
  addDeliveryToCart,
  setDeliveryData,
  setCartTransition,
  setCartVersion,
} = cartSlice.actions;

/** Exporting the reducer generated by createSlice */
export default cartSlice.reducer;
