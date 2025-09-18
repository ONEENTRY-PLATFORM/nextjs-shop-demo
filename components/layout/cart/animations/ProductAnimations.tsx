/* eslint-disable react/prop-types */
'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC, ReactNode } from 'react';
import { memo, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  getTransition,
  removeProduct,
  setCartTransition,
} from '@/app/store/reducers/CartSlice';

interface ProductAnimationsProps {
  children: ReactNode;
  className: string;
  index: number;
  product: IProductsEntity;
}

/**
 * Product animations
 *
 * @param children children ReactNode
 * @param className CSS className of ref element
 * @param product product entity object
 * @param index index of element in array for stagger
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 * @returns
 */
const ProductAnimations: FC<ProductAnimationsProps> = memo(
  ({ children, className, product, index }) => {
    const dispatch = useAppDispatch();
    const ref = useRef(null);
    const { transitionId } = useAppSelector(getTransition);

    // Memoized callback for removing product
    const removeProductCallback = useCallback(() => {
      dispatch(removeProduct(product.id));
      toast('Product ' + product.localizeInfos.title + ' removed from cart!');
    }, [dispatch, product.id, product.localizeInfos.title]);

    // Memoized callback for setting transition
    const setCartTransitionCallback = useCallback(() => {
      dispatch(
        setCartTransition({
          productId: 0,
        }),
      );
    }, [dispatch]);

    // first load animations
    useGSAP(() => {
      if (!ref.current) {
        return;
      }
      const tl = gsap.timeline({
        paused: true,
      });

      tl.set(ref.current, {
        opacity: 0,
        yPercent: 100,
      }).to(ref.current, {
        opacity: 1,
        yPercent: 0,
        delay: index / 10,
      });
      tl.play();

      return () => {
        tl.kill();
      };
    }, [index]);

    // remove Product from cart animations
    useGSAP(() => {
      if (!ref.current || product.id !== transitionId) {
        return;
      }
      const tl = gsap.timeline();

      tl.to(ref.current, {
        autoAlpha: 0,
        duration: 0.5,
        onStart: setCartTransitionCallback,
        onComplete: removeProductCallback,
      });

      return () => {
        tl.kill();
      };
    }, [
      product.id,
      transitionId,
      setCartTransitionCallback,
      removeProductCallback,
    ]);

    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  },
);

ProductAnimations.displayName = 'ProductAnimations';

export default ProductAnimations;
