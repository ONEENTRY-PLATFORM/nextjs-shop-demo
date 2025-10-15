'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { JSX, ReactNode } from 'react';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Form animations component for applying entrance and exit animations to forms.
 * Uses GSAP to animate form components as they appear or disappear in a drawer context.
 * @param   {object}      props           - FormAnimations Props.
 * @param   {ReactNode}   props.children  - children ReactNode.
 * @param   {boolean}     props.isLoading - loading state.
 * @returns {JSX.Element}                 A form component wrapper with animations applied.
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const FormAnimations = ({
  children,
  isLoading,
}: {
  children: ReactNode;
  isLoading: boolean;
}): JSX.Element => {
  /**
   * Get open, transition states, and setter from the OpenDrawerContext
   * These control the animation behavior of the form in the context of a drawer
   */
  const { open, transition, setTransition } = useContext(OpenDrawerContext);

  /**
   * Reference to the DOM element for animations
   * This ref is used by GSAP to directly manipulate the DOM element
   */
  const ref = useRef(null);

  /**
   * Form transition animations using GSAP
   * Handles animations when the form is opened or closed in a drawer
   */
  useGSAP(() => {
    /**
     * Exit early if the drawer is not open, reference is not set, or form is loading
     * This prevents unnecessary animations from running
     */
    if (!open || !ref.current || isLoading) {
      return;
    }

    /**
     * Create a new GSAP timeline for the form animations
     * The timeline is paused initially to allow for precise control
     */
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        /**
         * Reset transition state when animation completes
         * This allows for future transitions to be triggered
         */
        setTransition('');
      },
      onReverseComplete: () => {
        /**
         * Reset transition state when reverse animation completes
         * This ensures consistent behavior when closing the form
         */
        setTransition('');
      },
    });

    /**
     * Define animation from hidden (autoAlpha: 0) to visible (autoAlpha: 1)
     * autoAlpha combines opacity and visibility properties for better performance
     */
    tl.from(ref.current, {
      /** Initial state: hidden */
      autoAlpha: 0,
    }).to(ref.current, {
      /** Animate to visible state */
      autoAlpha: 1,
    });

    /**
     * Reverse or play the animation based on transition state
     * This provides different animations for opening and closing the form
     */
    if (transition === 'close') {
      /** Reverse the animation over 0.5 seconds */
      tl.reverse(0.5);
    } else {
      /** Play the animation */
      tl.play();
    }

    /**
     * Clean up function to kill the timeline
     * Prevents memory leaks by ensuring animations are properly disposed
     */
    return () => {
      tl.kill();
    };
  }, [transition, open, isLoading]); // Dependencies for re-running the animation

  /**
   * Render the component with the provided children
   * The ref is attached to allow GSAP to animate the element
   */
  return <div ref={ref}>{children}</div>;
};

export default FormAnimations;
