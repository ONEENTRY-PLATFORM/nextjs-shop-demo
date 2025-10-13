/* eslint-disable jsdoc/no-undefined-types */
'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX } from 'react';
import { useRef, useState } from 'react';

import type { AnimationsProps } from '@/app/types/global';

/**
 * Cart wrapper stage leaving animations component
 * Uses GSAP library to animate cart elements during page transitions
 * Specifically handles the leaving animation when navigating away from the cart page
 * @param   {AnimationsProps} props           - Cart wrapper props
 * @param   {ReactNode}       props.children  - children ReactNode elements to be animated
 * @param   {string}          props.className - CSS class names for styling the cart wrapper
 * @returns {JSX.Element}                     cart wrapper with entrance/exit animations
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const CartAnimations = ({
  children,
  className,
}: AnimationsProps): JSX.Element => {
  /** Get current transition stage (entering, leaving, none) from next-transition-router */
  const { stage } = useTransitionState();

  /** Track previous stage to determine transition direction */
  const [prevStage, setPrevStage] = useState<string>('');

  /** Reference to the cart wrapper element for GSAP animations */
  const ref = useRef(null);

  /**
   * GSAP animation effect for cart elements leaving animation
   * Handles fade-out animation when navigating away from the cart page
   * Animates product elements, table rows and total amount section
   */
  useGSAP(() => {
    /** Create GSAP timeline with reverse complete callback */
    const tl = gsap.timeline({
      paused: true,
      onReverseComplete: () => {
        /** Reset product elements to initial state after reverse animation completes */
        gsap.set(productElements, {
          autoAlpha: 0,
          yPercent: 100,
        });
      },
    });

    /**
     * Check if elements exist before creating animation
     * Get product elements with 'product-in-cart' class
     */
    const productElements = ref.current
      ? (ref.current as HTMLElement).querySelectorAll('.product-in-cart')
      : [];

    /** Get table row elements with 'tr' class */
    const trElements = ref.current
      ? (ref.current as HTMLElement).querySelectorAll('.tr')
      : [];

    /** Get total amount element with 'total' id */
    const totalElement = ref.current
      ? (ref.current as HTMLElement).querySelectorAll('#total')
      : [];

    /** Only create timeline if elements exist */
    if (
      productElements.length > 0 ||
      trElements.length > 0 ||
      totalElement.length > 0
    ) {
      /** Set initial state for all elements (hidden and shifted down) */
      tl.set([productElements, trElements, totalElement], {
        autoAlpha: 0,
        yPercent: 100,
      })
        /** Animate product elements with staggered delay */
        .to(productElements, {
          autoAlpha: 1,
          yPercent: 0,
          stagger: 0.1,
          delay: 0.35,
        })
        /** Animate table rows and total element */
        .to([trElements, totalElement], {
          autoAlpha: 1,
          yPercent: 0,
          stagger: 0.1,
        });

      /** Execute leaving animation when transitioning from 'none' to 'leaving' */
      if (stage === 'leaving' && prevStage === 'none') {
        tl.reverse(1.2);
      }

      /** Update previous stage to current stage for next render */
      setPrevStage(stage);
    }

    /** Cleanup function to kill timeline on unmount */
    return () => {
      tl.kill();
    };
  }, [stage, prevStage]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default CartAnimations;
