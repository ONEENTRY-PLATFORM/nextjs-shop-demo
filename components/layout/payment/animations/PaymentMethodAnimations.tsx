/* eslint-disable jsdoc/reject-function-type */
'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useRef, useState } from 'react';

/**
 * Payment method animations component.
 * Handles animation transitions for payment method selection with GSAP.
 * Manages height changes and fade effects when a payment method is activated/deactivated.
 * Also handles stage transitions during the payment flow.
 * @param   {object}      props           - Component properties.
 * @param   {ReactNode}   props.children  - Children ReactNode elements to be animated.
 * @param   {string}      props.className - CSS className to apply to the wrapper element.
 * @param   {number}      props.index     - Index of element for animations stagger effect.
 * @param   {boolean}     props.isActive  - Indicates if this payment method is currently active.
 * @param   {Function}    props.onClick   - Click handler for the payment method card (optional).
 * @returns {JSX.Element}                 Payment method animations wrapper component.
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const PaymentMethodAnimations = ({
  children,
  className,
  isActive,
  index,
  onClick,
}: {
  children: ReactNode;
  className: string;
  index: number;
  isActive: boolean;
  onClick?: () => void;
}): JSX.Element => {
  const { stage } = useTransitionState();
  const [prevStage, setPrevStage] = useState('');
  const ref = useRef(null);

  /**
   * Handles the animation when a payment method is activated or deactivated.
   * Changes the height of the container and fades in/out the cart data.
   * Uses GSAP for smooth animations.
   */
  useGSAP(() => {
    if (!ref.current) {
      return;
    }

    /** Set the transform origin for animations */
    gsap.set(ref.current, {
      transformOrigin: '0 0',
    });

    /** Create a timeline for the animation sequence */
    const tl = gsap.timeline({
      paused: true,
    });

    /** Find the cart data element to animate */
    const cartData = (ref.current as HTMLDivElement).querySelector('#cartData');

    if (isActive) {
      /** Animate height from fixed to auto when active */
      tl.fromTo(
        ref.current,
        {
          height: 110,
        },
        {
          height: 'auto',
        },
      )
        /** Fade in cart data with delay */
        .to(cartData, {
          autoAlpha: 1,
          delay: -0.5,
        })
        .play();
    } else {
      /** Animate height to fixed value when inactive */
      tl.to(ref.current, {
        height: 110,
      })
        /** Fade out cart data with delay */
        .to(cartData, {
          autoAlpha: 0,
          delay: -0.5,
        })
        .play();
    }

    /** Cleanup function to kill timeline on unmount */
    return () => {
      tl.kill();
    };
  }, [isActive]);

  /**
   * Handles stage transition animations during the payment flow.
   * Fades out elements with staggered delay based on index when leaving the stage.
   */
  useGSAP(() => {
    if (!ref.current) {
      return;
    }

    /** Create a timeline for stage transition animations */
    const tl = gsap.timeline({
      paused: true,
    });

    /** Animate opacity when leaving the initial stage */
    if (stage === 'leaving' && prevStage === 'none') {
      tl.to(ref.current, {
        autoAlpha: 0,
        delay: index / 10,
      }).play();
    }

    /** Update previous stage for comparison */
    setPrevStage(stage);

    /** Cleanup function to kill timeline on unmount */
    return () => {
      tl.kill();
    };
  }, [stage]);

  return (
    <div ref={ref} className={className} onClick={onClick}>
      {children}
    </div>
  );
};

export default PaymentMethodAnimations;
