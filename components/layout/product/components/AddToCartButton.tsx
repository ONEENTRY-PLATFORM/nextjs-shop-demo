'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

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
  product: IProductsEntity;
  className: string;
  height: number;
  dict: IAttributeValues;
}

const AddToCartButton: FC<AddToCartProps> = ({
  product,
  className,
  height,
  dict,
}) => {
  const dispatch = useAppDispatch();
  const { id } = product;
  const inCart = useAppSelector((state) => selectIsInCart(state, product.id));
  const items = useAppSelector((state) => state.cartReducer.productsData);
  const favoritesIds = useAppSelector(
    (state: { favoritesReducer: { products: number[] } }) =>
      selectFavoritesItems(state),
  ) as Array<number>;
  const [productInCart, setInCart] = useState(false);
  const { user } = useContext(AuthContext);

  const { out_of_stock_button, add_to_cart_button } = dict;

  useEffect(() => {
    setInCart(inCart);
  }, [inCart]);

  const notInStock =
    typeof product.statusIdentifier === 'string' &&
    product.statusIdentifier !== 'in_stock';

  if (notInStock) {
    return (
      <div className={'btn btn-o btn-o-gray ' + className}>
        {out_of_stock_button.value}
      </div>
    );
  }

  const onAddToCart = async () => {
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
    }
    dispatch(addProductToCart({ id: product.id, selected: true, quantity: 1 }));
    toast('Product ' + product.localizeInfos.title + ' added to cart!');
  };

  return !productInCart || !inCart ? (
    <button
      onClick={async () => onAddToCart()}
      type="button"
      className={className}
    >
      {add_to_cart_button.value}
    </button>
  ) : (
    <QuantitySelector product={product} height={height} />
  );
};

export default AddToCartButton;
