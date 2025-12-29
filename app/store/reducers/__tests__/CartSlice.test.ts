/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from 'vitest';

import cartReducer, {
  addDeliveryToCart,
  addProductsToCart,
  addProductToCart,
  decreaseProductQty,
  deselectProduct,
  increaseProductQty,
  removeAllProducts,
  removeProduct,
  setCartTransition,
  setCartVersion,
  setDeliveryData,
  setProductQty,
} from '../CartSlice';

describe('CartSlice', () => {
  const initialState = {
    products: [],
    productsData: [],
    delivery: {} as any,
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

  describe('addProductToCart', () => {
    it('should add new product to cart', () => {
      const newState = cartReducer(
        initialState,
        addProductToCart({ id: 1, selected: true, quantity: 2 }),
      );

      expect(newState.productsData).toHaveLength(1);
      expect(newState.productsData[0]).toEqual({
        id: 1,
        selected: true,
        quantity: 2,
      });
    });

    it('should increase quantity when adding existing product', () => {
      const stateWithProduct = {
        ...initialState,
        productsData: [{ id: 1, selected: true, quantity: 1 }],
      };

      const newState = cartReducer(
        stateWithProduct,
        addProductToCart({ id: 1, selected: true, quantity: 2 }),
      );

      expect(newState.productsData).toHaveLength(1);
      expect(newState.productsData[0]?.quantity).toBe(3); // 1 + 2
    });

    it('should ensure minimum quantity of 1', () => {
      const newState = cartReducer(
        initialState,
        addProductToCart({ id: 1, selected: true, quantity: 0 }),
      );

      expect(newState.productsData[0]?.quantity).toBe(1);
    });
  });

  describe('increaseProductQty', () => {
    it('should increase product quantity', () => {
      const stateWithProduct = {
        ...initialState,
        productsData: [{ id: 1, selected: true, quantity: 2 }],
      };

      const newState = cartReducer(
        stateWithProduct,
        increaseProductQty({ id: 1, quantity: 3, units: 10 }),
      );

      expect(newState.productsData[0]?.quantity).toBe(5); // 2 + 3
    });

    it('should not exceed maximum units', () => {
      const stateWithProduct = {
        ...initialState,
        productsData: [{ id: 1, selected: true, quantity: 8 }],
      };

      const newState = cartReducer(
        stateWithProduct,
        increaseProductQty({ id: 1, quantity: 5, units: 10 }),
      );

      expect(newState.productsData[0]?.quantity).toBe(10); // Clamped to max units
    });

    it('should add product if not in cart', () => {
      const newState = cartReducer(
        initialState,
        increaseProductQty({ id: 1, quantity: 1, units: 10 }),
      );

      expect(newState.productsData).toHaveLength(1);
      expect(newState.productsData[0]?.quantity).toBe(1);
    });
  });

  describe('decreaseProductQty', () => {
    it('should decrease product quantity', () => {
      const stateWithProduct = {
        ...initialState,
        productsData: [{ id: 1, selected: true, quantity: 5 }],
      };

      const newState = cartReducer(
        stateWithProduct,
        decreaseProductQty({ id: 1, quantity: 2 }),
      );

      expect(newState.productsData[0]?.quantity).toBe(3); // 5 - 2
    });

    it('should remove product when quantity reaches 0', () => {
      const stateWithProduct = {
        ...initialState,
        productsData: [{ id: 1, selected: true, quantity: 2 }],
      };

      const newState = cartReducer(
        stateWithProduct,
        decreaseProductQty({ id: 1, quantity: 2 }),
      );

      expect(newState.productsData).toHaveLength(0);
    });

    it('should remove product when quantity goes below 0', () => {
      const stateWithProduct = {
        ...initialState,
        productsData: [{ id: 1, selected: true, quantity: 1 }],
      };

      const newState = cartReducer(
        stateWithProduct,
        decreaseProductQty({ id: 1, quantity: 5 }),
      );

      expect(newState.productsData).toHaveLength(0);
    });
  });

  describe('setProductQty', () => {
    it('should set exact quantity', () => {
      const stateWithProduct = {
        ...initialState,
        productsData: [{ id: 1, selected: true, quantity: 5 }],
      };

      const newState = cartReducer(
        stateWithProduct,
        setProductQty({ id: 1, quantity: 3, units: 10 }),
      );

      expect(newState.productsData[0]?.quantity).toBe(3);
    });

    it('should remove product when quantity set to 0', () => {
      const stateWithProduct = {
        ...initialState,
        productsData: [{ id: 1, selected: true, quantity: 5 }],
      };

      const newState = cartReducer(
        stateWithProduct,
        setProductQty({ id: 1, quantity: 0, units: 10 }),
      );

      expect(newState.productsData).toHaveLength(0);
    });

    it('should not exceed maximum units', () => {
      const stateWithProduct = {
        ...initialState,
        productsData: [{ id: 1, selected: true, quantity: 5 }],
      };

      const newState = cartReducer(
        stateWithProduct,
        setProductQty({ id: 1, quantity: 20, units: 10 }),
      );

      expect(newState.productsData[0]?.quantity).toBe(10);
    });
  });

  describe('removeProduct', () => {
    it('should remove product from cart', () => {
      const stateWithProducts = {
        ...initialState,
        productsData: [
          { id: 1, selected: true, quantity: 2 },
          { id: 2, selected: true, quantity: 3 },
        ],
      };

      const newState = cartReducer(stateWithProducts, removeProduct(1));

      expect(newState.productsData).toHaveLength(1);
      expect(newState.productsData[0]?.id).toBe(2);
    });
  });

  describe('deselectProduct', () => {
    it('should toggle product selection', () => {
      const stateWithProduct = {
        ...initialState,
        productsData: [{ id: 1, selected: true, quantity: 2 }],
      };

      const newState = cartReducer(stateWithProduct, deselectProduct(1));

      expect(newState.productsData[0]?.selected).toBe(false);

      // Toggle back
      const toggledState = cartReducer(newState, deselectProduct(1));
      expect(toggledState.productsData[0]?.selected).toBe(true);
    });
  });

  describe('removeAllProducts', () => {
    it('should clear all products', () => {
      const stateWithProducts = {
        ...initialState,
        productsData: [
          { id: 1, selected: true, quantity: 2 },
          { id: 2, selected: true, quantity: 3 },
        ],
        products: [{ id: 1 }, { id: 2 }] as any,
      };

      const newState = cartReducer(stateWithProducts, removeAllProducts());

      expect(newState.productsData).toEqual([]);
      expect(newState.products).toEqual([]);
    });
  });

  describe('addProductsToCart', () => {
    it('should set products array', () => {
      const products = [{ id: 1 }, { id: 2 }] as any;
      const newState = cartReducer(initialState, addProductsToCart(products));

      expect(newState.products).toEqual(products);
    });
  });

  describe('setDeliveryData', () => {
    it('should update delivery data', () => {
      const deliveryData = {
        date: 1234567890,
        time: '10:00',
        address: '123 Main St',
        interval: [new Date(), new Date()],
      };

      const newState = cartReducer(initialState, setDeliveryData(deliveryData));

      expect(newState.deliveryData.date).toBe(deliveryData.date);
      expect(newState.deliveryData.time).toBe(deliveryData.time);
      expect(newState.deliveryData.address).toBe(deliveryData.address);
      expect(newState.deliveryData.interval).toEqual(deliveryData.interval);
    });

    it('should update delivery data without interval', () => {
      const deliveryData = {
        date: 1234567890,
        time: '10:00',
        address: '123 Main St',
      };

      const newState = cartReducer(initialState, setDeliveryData(deliveryData));

      expect(newState.deliveryData.interval).toEqual([]);
    });
  });

  describe('addDeliveryToCart', () => {
    it('should set delivery product', () => {
      const delivery = { id: 1, name: 'Standard Delivery' } as any;
      const newState = cartReducer(initialState, addDeliveryToCart(delivery));

      expect(newState.delivery).toEqual(delivery);
    });
  });

  describe('setCartTransition', () => {
    it('should set transition ID', () => {
      const newState = cartReducer(
        initialState,
        setCartTransition({ productId: 123 }),
      );

      expect(newState.transitionId).toBe(123);
    });
  });

  describe('setCartVersion', () => {
    it('should set cart version', () => {
      const newState = cartReducer(initialState, setCartVersion(5));

      expect(newState.version).toBe(5);
    });
  });
});
