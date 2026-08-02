'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  addProductToCart,
  removeProduct,
  selectIsInCart,
} from '@/app/store/reducers/CartSlice';

/**
 * Apply button component.
 * @param   {object}           props         - Component properties.
 * @param   {IProductsEntity}  props.product - Product entity object containing product information.
 * @param   {IAttributeValues} props.dict    - Dictionary from server API containing localized text values.
 * @returns {JSX.Element}                    Apply button that adds/removes group product to/from cart.
 */
const ApplyButton = ({
  product,
  dict,
}: {
  product: IProductsEntity;
  dict: IAttributeValues;
}): JSX.Element => {
  /** Redux dispatch function for state updates */
  const dispatch = useAppDispatch();

  /** Extract localized text values from dictionary */
  const { apply_button_placeholder, cancel_text } = dict;

  /** Check if product is currently in cart using Redux selector */
  const inCart = useAppSelector((state) => selectIsInCart(state, product.id));

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
  return !inCart ? (
    <button
      onClick={() => addToCartHandle()}
      className="btn btn-md btn-o btn-o-primary mt-auto text-sm font-bold"
    >
      {apply_button_placeholder?.value as string}
    </button>
  ) : (
    <button
      onClick={() => removeFromCartHandle()}
      className="btn btn-md btn-o btn-o-primary mt-auto text-sm font-bold"
    >
      {cancel_text?.value as string}
    </button>
  );
};

export default ApplyButton;
