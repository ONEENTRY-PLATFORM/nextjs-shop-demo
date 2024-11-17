'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FC } from 'react';
import { useContext, useEffect, useState } from 'react';
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

interface AddToCartProps {
  id: number;
  units: number;
  productTitle: string;
  statusIdentifier: string;
  className: string;
  height: number;
  dict: IAttributeValues;
}

/**
 * AddToCart button with qty selector
 * @param id product id
 * @param units product units qty
 *
 * @returns Button | Qty selector
 */
const AddToCartButton: FC<AddToCartProps> = ({
  id,
  units,
  productTitle,
  statusIdentifier,
  className,
  height,
  dict,
}) => {
  const dispatch = useAppDispatch();
  const inCart = useAppSelector((state) => selectIsInCart(state, id));
  const items = useAppSelector((state) => state.cartReducer.productsData);
  const favoritesIds = useAppSelector(
    (state: { favoritesReducer: { products: number[] } }) =>
      selectFavoritesItems(state),
  ) as Array<number>;
  const [productInCart, setInCart] = useState(false);
  const { user } = useContext(AuthContext);

  const { out_of_stock_button, add_to_cart_button } = dict;

  const notInStock = statusIdentifier !== 'in_stock';

  useEffect(() => {
    setInCart(inCart);
  }, [inCart]);

  // If not InStock show out_of_stock button
  if (notInStock && out_of_stock_button) {
    return (
      <div className={'btn btn-o btn-o-gray ' + className}>
        {out_of_stock_button.value}
      </div>
    );
  }

  // Add to cart, update user state and subscribe to events
  const addToCartHandle = async (): Promise<void> => {
    dispatch(addProductToCart({ id: id, selected: true, quantity: 1 }));
    toast('Product ' + productTitle + ' added to cart!');

    // Update user state and subscribe to events
    if (user) {
      const updatedItems = items.some(
        (product: { id: number }) => product.id === id,
      )
        ? items.map((product: { id: number; quantity: number }) => {
            return {
              id: product.id,
              quantity:
                product.id === id ? product.quantity + 1 : product.quantity,
              selected: true,
            };
          })
        : [...items, { id, quantity: 1, selected: true }];

      await updateUserState({
        favorites: favoritesIds,
        cart: updatedItems,
        user: user,
      });

      await onSubscribeEvents(id);
    }
  };

  return !productInCart ? (
    <button
      onClick={() => addToCartHandle()}
      type="button"
      className={className}
    >
      {add_to_cart_button.value}
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
