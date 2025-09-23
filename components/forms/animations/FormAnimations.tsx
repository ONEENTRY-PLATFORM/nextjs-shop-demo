'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { FC, ReactNode } from 'react';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

interface FormAnimationsProps {
  children: ReactNode;
  isLoading: boolean;
}

/**
 * Form animations
 *
 * @param children children ReactNode
 * @param isLoading loading state
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 * @returns A form component wrapper with animations applied
 */
const FormAnimations: FC<FormAnimationsProps> = ({ children, isLoading }) => {
  const { open, transition, setTransition } = useContext(OpenDrawerContext); // Get open, transition states, and setter from context
  const ref = useRef(null); // Reference to the DOM element for animations

  // Form transition animations
  useGSAP(() => {
    // Exit early if the drawer is not open, reference is not set, or form is loading
    if (!open || !ref.current || isLoading) {
      return;
    }

    const tl = gsap.timeline({
      paused: true, // Create a new GSAP timeline and pause it initially
      onComplete: () => {
        setTransition(''); // Reset transition state when animation completes
      },
      onReverseComplete: () => {
        setTransition(''); // Reset transition state when reverse animation completes
      },
    });

    // Define animation from hidden (autoAlpha: 0) to visible (autoAlpha: 1)
    tl.from(ref.current, {
      autoAlpha: 0, // Initial state: hidden
    }).to(ref.current, {
      autoAlpha: 1, // Animate to visible state
    });

    // Reverse or play the animation based on transition state
    if (transition === 'close') {
      tl.reverse(0.5); // Reverse the animation over 0.5 seconds
    } else {
      tl.play(); // Play the animation
    }

    return () => {
      tl.kill(); // Clean up the timeline on unmount or dependency change
    };
  }, [transition, open, isLoading]); // Dependencies for re-running the animation

  // Render the component with the provided children
  return <div ref={ref}>{children}</div>;
};

export default FormAnimations;
