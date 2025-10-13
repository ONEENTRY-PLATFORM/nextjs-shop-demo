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
 * Product animations component that handles entrance and exit animations for cart products
 * Uses GSAP library to animate product cards when they are added or removed from the cart
 * Implements staggered entrance animation and smooth removal animation with toast notification
 * Wrapped with memo to prevent unnecessary re-renders
 * @param props           - ProductAnimationsProps
 * @param props.children  - children ReactNode elements to be animated
 * @param props.className - CSS class names for styling the product wrapper
 * @param props.product   - Product entity object containing product data
 * @param props.index     - Index of element in array for staggered animation timing
 * @returns               Product wrapper with entrance/exit animations
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
    /** Redux dispatch function for updating state */
    const dispatch = useAppDispatch();

    /** Reference to the product wrapper element for GSAP animations */
    const ref = useRef(null);

    /** Get transition ID from Redux store to determine if product should be removed */
    const { transitionId } = useAppSelector(getTransition);

    /** Extract localized information from product */
    const { localizeInfos } = product;

    /**
     * Memoized callback for removing product from cart
     * Dispatches removeProduct action and shows toast notification
     */
    const removeProductCallback = useCallback(() => {
      /** Dispatch action to remove product from cart in Redux store */
      dispatch(removeProduct(product.id));

      /** Show toast notification about product removal */
      toast('Product ' + localizeInfos.title + ' removed from cart!');
    }, [dispatch, product.id, localizeInfos.title]);

    /**
     * Memoized callback for setting cart transition state
     * Dispatches setCartTransition action with default productId
     */
    const setCartTransitionCallback = useCallback(() => {
      /** Dispatch action to set cart transition state in Redux store */
      dispatch(
        setCartTransition({
          productId: 0,
        }),
      );
    }, [dispatch]);

    /**
     * GSAP animation effect for initial product entrance animation
     * Handles staggered fade-in and slide-up animation when product is added to cart
     */
    useGSAP(() => {
      /** Exit early if ref is not available */
      if (!ref.current) {
        return;
      }

      /** Create GSAP timeline for entrance animation */
      const tl = gsap.timeline({
        paused: true,
      });

      /** Set initial state (hidden and shifted down) and animate to visible state */
      tl.set(ref.current, {
        opacity: 0,
        yPercent: 100,
      }).to(ref.current, {
        opacity: 1,
        yPercent: 0,
        delay: index / 10, // Staggered delay based on index
      });

      /** Play the entrance animation */
      tl.play();

      /** Cleanup function to kill timeline on unmount */
      return () => {
        tl.kill();
      };
    }, [index]);

    /**
     * GSAP animation effect for product removal animation
     * Handles fade-out animation when product is removed from cart
     */
    useGSAP(() => {
      /** Exit early if ref is not available or product is not the one being removed */
      if (!ref.current || product.id !== transitionId) {
        return;
      }

      /** Create GSAP timeline for removal animation */
      const tl = gsap.timeline();

      /** Animate element to fade out with callbacks for transition and removal */
      tl.to(ref.current, {
        autoAlpha: 0,
        duration: 0.5,
        onStart: setCartTransitionCallback, // Set transition state at start of animation
        onComplete: removeProductCallback, // Remove product from cart when animation completes
      });

      /** Cleanup function to kill timeline on unmount */
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
