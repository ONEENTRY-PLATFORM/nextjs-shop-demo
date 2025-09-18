'use client';

// Importing necessary types and functions from Redux Toolkit
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
// Importing product entity interface
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

// Importing custom product type
import type { IProducts } from '@/app/types/global';

// Defining the shape of the initial state for the cart slice
type InitialStateType = {
  products: IProductsEntity[]; // Array to store product entities
  productsData: IProducts[]; // Array to store product data with additional properties like quantity
  currency?: string; // Optional currency type
  delivery: IProductsEntity; // Delivery product entity
  deliveryData: {
    // Details about delivery
    date: number; // Delivery date as a timestamp
    time: string; // Delivery time
    address: string; // Delivery address
  };
  transitionId: number; // ID used for transitions/animations
  total: number; // Total cost of items in the cart
  version: number; // Version of the cart, useful for updates
};

// Initial state setup for the cart slice
const initialState: InitialStateType = {
  products: [], // Initialize empty array for products
  productsData: [], // Initialize empty array for product data
  delivery: {} as IProductsEntity, // Initialize delivery as an empty object casted to IProductsEntity
  deliveryData: {
    date: new Date().getTime(), // Current timestamp for delivery date
    time: '', // Empty string for delivery time
    address: '', // Empty string for delivery address
  },
  transitionId: 0, // Default transition ID
  total: 0, // Default total cost
  version: 0, // Default version
};

// Creating a Redux slice for cart management
export const cartSlice = createSlice({
  name: 'cart-slice', // Name of the slice
  initialState, // Initial state defined above
  reducers: {
    // Reducer to add a product to the cart
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
    /**
     * Reducer to add multiple products to the cart
     */
    addProductsToCart(state, action: PayloadAction<IProductsEntity[]>) {
      state.products = action.payload;
    },
    /**
     * Reducer to increase the quantity of a product in the cart
     */
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
    /**
     * Reducer to decrease the quantity of a product in the cart
     */
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
    /**
     * Reducer to set the quantity of a product in the cart
     */
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
    /**
     * Reducer to remove a product from the cart
     */
    removeProduct(state, action: PayloadAction<number>) {
      state.productsData = state.productsData.filter(
        (item: IProducts) => item.id !== action.payload,
      );
    },
    /**
     * Reducer to toggle the selection status of a product in the cart
     */
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
    /**
     * Reducer to remove all products from the cart
     */
    removeAllProducts(state) {
      state.productsData = initialState.productsData;
      state.products = initialState.products;
    },
    /**
     * Reducer to add delivery information to the cart
     */
    addDeliveryToCart(state, action: PayloadAction<IProductsEntity>) {
      state.delivery = action.payload;
    },
    /**
     * Reducer to set delivery data
     */
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
    /**
     * Reducer to set the transition ID for animations
     */
    setCartTransition(state, action: PayloadAction<{ productId: number }>) {
      state.transitionId = action.payload.productId;
    },
    /**
     * Reducer to set the cart version
     */
    setCartVersion(state, action: PayloadAction<number>) {
      state.version = action.payload;
    },
  },
});

// Exporting actions generated by createSlice
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
 * @param state The current state of the Redux store
 * @param id Product ID to check
 *
 * @returns Boolean indicating if the product is in the cart
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
 * @param state The current state of the Redux store
 *
 * @returns Array of products data in the cart
 */
export const selectCartData = (state: {
  cartReducer: { productsData: IProducts[] };
}) => state.cartReducer.productsData;

/**
 * Select cart items
 *
 * @param state The current state of the Redux store
 *
 * @returns Array of product entities in the cart
 */
export const selectCartItems = (state: {
  cartReducer: { products: IProductsEntity[] };
}) => state.cartReducer.products;

/**
 * Select delivery data
 *
 * @param state The current state of the Redux store
 *
 * @returns Delivery data object
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
 * @param state The current state of the Redux store
 *
 * @returns Total cost of selected products in the cart
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
 * @param state The current state of the Redux store
 * @param id Product ID to find
 *
 * @returns Product data object if found, otherwise undefined
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
 * @param state The current state of the Redux store
 *
 * @returns Transition ID for animations
 */
export const getTransition = (state: {
  cartReducer: {
    transitionId: number;
  };
}) => state.cartReducer;

/**
 * Select cart version
 *
 * @param state The current state of the Redux store
 *
 * @returns Cart version number
 */
export const selectCartVersion = (state: {
  favoritesReducer: { version: number };
}) => state.favoritesReducer.version;

// Exporting the reducer generated by createSlice
export default cartSlice.reducer;
