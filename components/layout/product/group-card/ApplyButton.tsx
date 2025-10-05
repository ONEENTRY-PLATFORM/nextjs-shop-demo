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
 * Apply button.
 * @param props         - component props.
 * @param props.product - product entity object.
 * @param props.dict    - dictionary from server api.
 * @returns             Apply button adds group product to cart.
 */

const ApplyButton = ({
  product,
  dict,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
  dict: IAttributeValues;
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const [productInCart, setInCart] = useState(false);
  const { apply_button_placeholder, cancel_text } = dict;
  const inCart = useAppSelector((state) => selectIsInCart(state, product.id));

  useEffect(() => {
    setInCart(inCart);
  }, [inCart]);

  const addToCartHandle = () => {
    dispatch(addProductToCart({ id: product.id, selected: true, quantity: 1 }));
  };

  const removeFromCartHandle = () => {
    dispatch(removeProduct(product.id));
  };

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
