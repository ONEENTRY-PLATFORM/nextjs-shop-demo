'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX, ReactNode } from 'react';
import { memo, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  getTransition,
  removeProduct,
  setCartTransition,
} from '@/app/store/reducers/CartSlice';

/**
 * Product animations
 * @param props           - ProductAnimationsProps.
 * @param props.children  - children ReactNode.
 * @param props.className - CSS className of ref element.
 * @param props.product   - product entity object.
 * @param props.index     - index of element in array for stagger.
 * @returns               JSX.Element.
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const ProductAnimations = memo(
  ({
    children,
    className,
    product,
    index,
  }: {
    children: ReactNode;
    className: string;
    index: number;
    product: IProductsEntity;
  }): JSX.Element => {
    const dispatch = useAppDispatch();
    const ref = useRef(null);
    const { transitionId } = useAppSelector(getTransition);
    const { localizeInfos } = product;
    // Memoized callback for removing product
    const removeProductCallback = useCallback(() => {
      dispatch(removeProduct(product.id));
      toast('Product ' + localizeInfos.title + ' removed from cart!');
    }, [dispatch, product.id, localizeInfos.title]);

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
