/* eslint-disable jsdoc/reject-any-type */
'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  addProductToCart,
  removeProduct,
  selectIsInCart,
} from '@/app/store/reducers/CartSlice';

/**
 * Apply button component.
 * Provides functionality to add or remove group products from the cart.
 * Displays different text based on whether the product is already in the cart.
 * Uses local state to track cart status and Redux for actual cart operations.
 * @param   {object}           props         - Component properties.
 * @param   {any}              props.product - Product entity object containing product information.
 * @param   {IAttributeValues} props.dict    - Dictionary from server API containing localized text values.
 * @returns {JSX.Element}                    Apply button that adds/removes group product to/from cart.
 */
const ApplyButton = ({
  product,
  dict,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
  dict: IAttributeValues;
}): JSX.Element => {
  /** Redux dispatch function for state updates */
  const dispatch = useAppDispatch();

  /** Local state to track if product is in cart */
  const [productInCart, setInCart] = useState(false);

  /** Extract localized text values from dictionary */
  const { apply_button_placeholder, cancel_text } = dict;

  /** Check if product is currently in cart using Redux selector */
  const inCart = useAppSelector((state) => selectIsInCart(state, product.id));

  /**
   * Update local state when Redux cart status changes.
   * Keeps local state synchronized with global Redux state.
   */
  useEffect(() => {
    setInCart(inCart);
  }, [inCart]);

  /**
   * Add product to cart handler.
   * Dispatches action to add the product to cart with default quantity of 1.
   */
  const addToCartHandle = () => {
    dispatch(addProductToCart({ id: product.id, selected: true, quantity: 1 }));
  };

  /**
   * Remove product from cart handler.
   * Dispatches action to remove the product from cart.
   */
  const removeFromCartHandle = () => {
    dispatch(removeProduct(product.id));
  };

  /* Render button with different text and actions based on cart status */
  return !productInCart || !inCart ? (
    <button
      onClick={() => addToCartHandle()}
      className="btn btn-md btn-o btn-o-primary mt-auto text-sm font-bold"
    >
      {apply_button_placeholder?.value}
    </button>
  ) : (
    <button
      onClick={() => removeFromCartHandle()}
      className="btn btn-md btn-o btn-o-primary mt-auto text-sm font-bold"
    >
      {cancel_text?.value}
    </button>
  );
};

export default ApplyButton;
