'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useContext, useRef, useState } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Form field animations component for applying staggered entrance animations to form fields.
 * Uses GSAP to animate form fields as they appear, creating a smooth visual effect.
 * @param   {object}      props           - Props for the FormFieldAnimations component.
 * @param   {ReactNode}   props.children  - children ReactNode.
 * @param   {string}      props.className - CSS className of ref element.
 * @param   {number}      props.index     - Index of element for animations stagger.
 * @returns {JSX.Element}                 Form field animations.
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const FormFieldAnimations = ({
  children,
  className,
  index,
}: {
  children: ReactNode;
  className: string;
  index: number;
}): JSX.Element => {
  /**
   * Get the current transition stage from next-transition-router
   * Used to determine when components are entering or leaving the view
   */
  const { stage } = useTransitionState();

  /**
   * State to track the previous transition stage
   * Helps determine the direction of transitions
   */
  const [prevStage, setPrevStage] = useState<string>('');

  /**
   * Get open and transition states from the OpenDrawerContext
   * These control the animation behavior of the form fields in the context of a drawer
   */
  const { open, transition } = useContext(OpenDrawerContext);

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
     * Exit early if the reference is not set
     * Prevents errors when the component is not yet mounted
     */
    if (!ref.current) {
      return;
    }

    /**
     * Set initial GSAP properties for the element
     */
    gsap.set(ref.current, {
      transformOrigin: '0 0', // Set the transform origin for scaling animations
      overflow: 'hidden', // Hide overflow to prevent content from spilling out
    });

    /**
     * Create a new GSAP timeline for the entrance animation
     */
    const tl = gsap.timeline({
      paused: true, // Create a new GSAP timeline and pause it initially
    });

    /**
     * Define animation from hidden (width: 0, opacity: 0) to visible (width: 100%, opacity: 1)
     * This creates a smooth entrance effect for form fields
     */
    tl.fromTo(
      ref.current,
      {
        width: 0,
        opacity: 0,
      },
      {
        width: '100%',
        opacity: 1,
        delay: index / 10 + 0.35,
      },
    );
    tl.play();

    /**
     * Reverse the animation if transitioning to close
     * This provides a smooth exit animation when the drawer is closing
     */
    if (transition === 'close') {
      tl.reverse(index / 10 + 0.65);
    }

    /**
     * Clean up function to kill the timeline
     * Prevents memory leaks by ensuring animations are properly disposed
     */
    return () => {
      tl.kill();
    };
  }, [transition, open]);

  /**
   * Form stage leaving animations using GSAP
   * Handles animations when transitioning between different stages of the form
   */
  useGSAP(() => {
    /**
     * Create a new GSAP timeline for stage transition animations
     */
    const tl = gsap.timeline({
      paused: true,
    });

    /**
     * Define animation from hidden (width: 0, opacity: 0) to visible (width: 100%, opacity: 1)
     * This creates a smooth entrance effect for form fields
     */
    tl.fromTo(
      ref.current,
      {
        width: 0,
        opacity: 0,
      },
      {
        width: '100%',
        opacity: 1,
        delay: index / 10 + 0.35,
      },
    );

    /**
     * Reverse the animation if the current stage is 'leaving' and the previous stage was 'none'
     * This provides a smooth exit animation when transitioning between form stages
     */
    if (stage === 'leaving' && prevStage === 'none') {
      // Reverse the animation over 1 second
      tl.reverse(1);
    }
    // Update the previous stage
    setPrevStage(stage);

    /**
     * Clean up function to kill the timeline
     * Prevents memory leaks by ensuring animations are properly disposed
     */
    return () => {
      tl.kill();
    };
  }, [stage]);

  /**
   * Render the component with the provided className and children
   * The ref is attached to allow GSAP to animate the element
   */
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default FormFieldAnimations;
