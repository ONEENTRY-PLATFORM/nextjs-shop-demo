'use client';

import type { PayloadAction, WritableDraft } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import type { IProducts } from '@/app/types/global';

/**
 * Defining the shape of the initial state for the cart slice
 * @property {IProductsEntity[]} products     - Array of product entities.
 * @property {IProducts[]}       productsData - Array of product data with additional properties like quantity.
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

/**
 * Initial state setup for the cart slice.
 * @property {Array}  products     - Array of product entities.
 * @property {Array}  productsData - Array of product data with additional properties like quantity.
 * @property {object} delivery     - Delivery product entity.
 * @property {object} deliveryData - Details about delivery.
 * @property {number} transitionId - ID used for transitions/animations.
 * @property {number} total        - Total cost of items in the cart.
 * @property {number} version      - Version of the cart, useful for updates.
 */
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
     * Add a product to the cart
     * @param {WritableDraft<InitialStateType>} state  - Current state
     * @param {PayloadAction<string>}           action - Payload with product id, selection status and quantity
     */
    addProductToCart(
      state: WritableDraft<InitialStateType>,
      action: PayloadAction<{
        id: number;
        selected: boolean;
        quantity: number;
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
     * Increase the quantity of a product in the cart
     * @param {WritableDraft<InitialStateType>} state  - Current state
     * @param {PayloadAction<string>}           action - Payload with units, id and quantity
     */
    increaseProductQty(
      state: WritableDraft<InitialStateType>,
      action: PayloadAction<{ units: number; id: number; quantity: number }>,
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
    },
    /**
     * Decrease the quantity of a product in the cart
     * @param {WritableDraft<InitialStateType>} state  - Current state
     * @param {PayloadAction<string>}           action - Payload with id and quantity
     */
    decreaseProductQty(
      state: WritableDraft<InitialStateType>,
      action: PayloadAction<{ id: number; quantity: number }>,
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
        return;
      }

      state.productsData[index] = {
        id: state.productsData[index]?.id || action.payload.id,
        selected: state.productsData[index]?.selected ?? true,
        quantity: qty,
      };
    },
    /**
     * Set the quantity of a product in the cart
     * @param {WritableDraft<InitialStateType>} state  - Current state
     * @param {PayloadAction<string>}           action - Payload with units, id and quantity
     */
    setProductQty(
      state: WritableDraft<InitialStateType>,
      action: PayloadAction<{ units: number; id: number; quantity: number }>,
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
    },
    /**
     * Remove a product from the cart
     * @param {WritableDraft<InitialStateType>} state  - Current state
     * @param {PayloadAction<string>}           action - Payload with product id
     */
    removeProduct(
      state: WritableDraft<InitialStateType>,
      action: PayloadAction<number>,
    ) {
      state.productsData = state.productsData.filter(
        (item: IProducts) => item.id !== action.payload,
      );
    },
    /**
     * Toggle the selection status of a product in the cart
     * @param {WritableDraft<InitialStateType>} state  - Current state
     * @param {PayloadAction<string>}           action - Payload with product id
     */
    deselectProduct(
      state: WritableDraft<InitialStateType>,
      action: PayloadAction<number>,
    ) {
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
    /**
     * Remove all products from the cart
     * @param {WritableDraft<InitialStateType>} state - Current state
     */
    removeAllProducts(state: WritableDraft<InitialStateType>) {
      state.productsData = initialState.productsData;
      state.products = initialState.products;
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
      action: PayloadAction<{ date: number; time: string; address: string }>,
    ) {
      state.deliveryData = {
        date: action.payload.date,
        time: action.payload.time,
        address: action.payload.address,
      };
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
 * @param   {object}  state                                  - The current state of the Redux store.
 * @param   {object}  state.cartReducer                      - Cart reducer state.
 * @param   {object}  state.cartReducer.deliveryData         - Delivery data object.
 * @param   {number}  state.cartReducer.deliveryData.date    - Delivery date.
 * @param   {string}  state.cartReducer.deliveryData.time    - Delivery time.
 * @param   {string}  state.cartReducer.deliveryData.address - Delivery address.
 * @returns {unknown}                                        Delivery data object containing date, time and address.
 */
export const selectDeliveryData = (state: {
  cartReducer: {
    deliveryData: { date: number; time: string; address: string };
  };
}): unknown => state.cartReducer.deliveryData;

/**
 * Select cart total.
 * @param   {object}            state                          - The current state of the Redux store.
 * @param   {object}            state.cartReducer              - Cart reducer state.
 * @param   {IProducts[]}       state.cartReducer.productsData - Cart products data.
 * @param   {IProductsEntity[]} state.cartReducer.products     - Cart products.
 * @returns {number}                                           Total cost of selected products in the cart.
 */
export const selectCartTotal = (state: {
  cartReducer: {
    productsData: IProducts[];
    products: IProductsEntity[];
  };
}): number => {
  return state.cartReducer.productsData.reduce((total, product) => {
    if (product.selected) {
      /** Find product by ID instead of using index */
      const p = state.cartReducer.products.find((p) => p.id === product.id);

      /** Check if product is in stock */
      const isInStock =
        p?.statusIdentifier === 'in_stock' &&
        (p?.attributeValues?.units_product?.value ?? 0) >= 1;

      /** Only add to total if product is in stock */
      if (isInStock) {
        const price = p
          ? p.attributeValues?.sale?.value ||
            p.attributeValues?.price?.value ||
            p.price ||
            0
          : 0;
        total += price * product.quantity;
      }
    }
    return total;
  }, 0);
};

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
  addDeliveryToCart,
  setDeliveryData,
  setCartTransition,
  setCartVersion,
} = cartSlice.actions;

/** Exporting the reducer generated by createSlice */
export default cartSlice.reducer;
