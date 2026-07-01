'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';
import { useContext, useMemo } from 'react';
import { toast } from 'react-toastify';

import { onSubscribeEvents } from '@/app/api/hooks/useEvents';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import {
  addProductToCart,
  selectIsInCart,
} from '@/app/store/reducers/CartSlice';

import QuantitySelector from './QuantitySelector';

/**
 * AddToCart button with quantity selector component.
 * @param   {object}           props                  - Component properties.
 * @param   {number}           props.id               - Product ID for identification.
 * @param   {number}           props.units            - Available product units/quantity.
 * @param   {string}           props.productTitle     - Product title for display and accessibility.
 * @param   {string}           props.statusIdentifier - Product status identifier (e.g., 'in_stock').
 * @param   {string}           props.className        - CSS class name for styling.
 * @param   {number}           props.height           - Component height for quantity selector.
 * @param   {IAttributeValues} props.dict             - Dictionary from server API containing localized text values.
 * @returns {JSX.Element}                             Button or quantity selector component.
 */
const AddToCartButton = ({
  id,
  units,
  productTitle,
  statusIdentifier,
  className,
  height,
  dict,
}: {
  id: number;
  units: number;
  productTitle: string;
  statusIdentifier: string;
  className: string;
  height: number;
  dict: IAttributeValues;
}): JSX.Element => {
  /** Redux dispatch function for state updates */
  const dispatch = useAppDispatch();

  /** Check if product is already in cart */
  const inCart = useAppSelector((state) => selectIsInCart(state, id));

  /** Get user authentication context */
  const { user, isAuth } = useContext(AuthContext);

  /** Extract localized text values from dictionary */
  const { out_of_stock_button, add_to_cart_button } = dict;

  /** Determine if product is out of stock based on status identifier */
  const notInStock = useMemo(
    () => statusIdentifier !== 'in_stock',
    [statusIdentifier],
  );

  /** If not InStock show out_of_stock button */
  if (notInStock || units < 1) {
    return (
      <div className={'btn btn-o btn-o-gray ' + className}>
        {(out_of_stock_button?.value as string) || 'Out of stock'}
      </div>
    );
  }

  /**
   * Subscribe to this product's events for an authenticated user.
   *
   * Server-side cart sync is handled centrally by the {@link AuthContext} push
   * effect (it writes the merged tombstone ledger whenever the cart changes),
   * so this only needs to register the event subscription.
   * @returns {Promise<void>} Promise that resolves once subscribed.
   */
  const subscribeToCartProduct = async (): Promise<void> => {
    if (!user) {
      return;
    }
    await onSubscribeEvents(id);
  };

  /**
   * Add product to cart handler.
   * Dispatches action to add product to cart, shows toast notification,
   * and subscribes to product events if authenticated.
   * @returns {Promise<void>} Promise that resolves when product is added to cart.
   */
  const addToCartHandle = async (): Promise<void> => {
    /** Dispatch action to add product to cart with default quantity of 1 */
    dispatch(addProductToCart({ id: id, selected: true, quantity: 1 }));

    /** Show toast notification confirming product addition */
    toast('Product ' + productTitle + ' added to cart!');

    /** Subscribe to events if user is authenticated */
    if (user && isAuth) {
      subscribeToCartProduct();
    }
  };

  return !inCart ? (
    <button
      onClick={() => addToCartHandle()}
      type="button"
      className={className}
      aria-label={`Add ${productTitle} to cart`}
      // test id for e2e testing
      data-testid="add-to-cart-button"
    >
      {add_to_cart_button?.value as string}
    </button>
  ) : (
    <QuantitySelector
      height={height}
      id={id}
      units={units}
      title={productTitle}
    />
  );
};

export default AddToCartButton;
