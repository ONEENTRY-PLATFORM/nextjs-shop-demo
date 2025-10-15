'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';
import { useContext, useMemo } from 'react';
import { toast } from 'react-toastify';

import { onSubscribeEvents } from '@/app/api/hooks/useEvents';
import { updateUserState } from '@/app/api/server/users/updateUserState';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import {
  addProductToCart,
  selectIsInCart,
} from '@/app/store/reducers/CartSlice';
import { selectFavoritesItems } from '@/app/store/reducers/FavoritesSlice';

import QuantitySelector from './QuantitySelector';

/**
 * AddToCart button with quantity selector component.
 * Displays either an "Add to Cart" button or a quantity selector based on product availability and cart status.
 * Handles product addition to cart with user state synchronization and event subscriptions.
 * Shows "Out of Stock" button when product is not available.
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

  /** Retrieve current cart items from Redux store */
  const items = useAppSelector((state) => state.cartReducer.productsData);

  /** Retrieve favorite items IDs from Redux store */
  const favoritesIds: number[] = useAppSelector(
    (state: { favoritesReducer: { products: number[] } }) =>
      selectFavoritesItems(state),
  );

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
        {out_of_stock_button?.value || 'Out of stock'}
      </div>
    );
  }

  /**
   * Update user state and subscribe to events.
   * Synchronizes the user's cart state with the backend and subscribes to product events.
   * @returns {Promise<void>} Promise that resolves when user state is updated.
   */
  const updateUserCartState = async (): Promise<void> => {
    /** Exit early if no user is available */
    if (!user) {
      return;
    }

    /** Update cart items with either incremented quantity or new item */
    const updatedItems = items.some((product) => product.id === id)
      ? items.map((product) => ({
          id: product.id,
          quantity: product.id === id ? product.quantity + 1 : product.quantity,
          selected: true,
        }))
      : [...items, { id, quantity: 1, selected: true }];

    /** Update user state with new cart and favorites data */
    await updateUserState({
      favorites: favoritesIds,
      cart: updatedItems,
      user: user,
    });

    /** Subscribe to events for this product */
    await onSubscribeEvents(id);
  };

  /**
   * Add product to cart handler.
   * Dispatches action to add product to cart, shows toast notification,
   * and updates user state if authenticated.
   * @returns {Promise<void>} Promise that resolves when product is added to cart.
   */
  const addToCartHandle = async (): Promise<void> => {
    /** Dispatch action to add product to cart with default quantity of 1 */
    dispatch(addProductToCart({ id: id, selected: true, quantity: 1 }));

    /** Show toast notification confirming product addition */
    toast('Product ' + productTitle + ' added to cart!');

    /** Update user state and subscribe to events if user is authenticated */
    if (user && isAuth) {
      updateUserCartState();
    }
  };

  return !inCart ? (
    <button
      onClick={() => addToCartHandle()}
      type="button"
      className={className}
      aria-label={`Add ${productTitle} to cart`}
    >
      {add_to_cart_button?.value}
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
