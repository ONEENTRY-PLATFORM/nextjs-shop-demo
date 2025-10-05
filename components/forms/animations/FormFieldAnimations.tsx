'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useContext, useRef, useState } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Form field animations.
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
  // Get the current transition stage
  const { stage } = useTransitionState();
  // State to track the previous stage
  const [prevStage, setPrevStage] = useState<string>('');
  // Get open and transition states from context
  const { open, transition } = useContext(OpenDrawerContext);
  // Reference to the DOM element for animations
  const ref = useRef(null);

  // Form transition animations
  useGSAP(() => {
    // Exit early if the reference is not set
    if (!ref.current) {
      return;
    }

    gsap.set(ref.current, {
      transformOrigin: '0 0', // Set the transform origin for scaling animations
      overflow: 'hidden', // Hide overflow to prevent content from spilling out
    });

    const tl = gsap.timeline({
      paused: true, // Create a new GSAP timeline and pause it initially
    });

    // Define animation from hidden (width: 0, opacity: 0) to visible (width: 100%, opacity: 1)
    tl.fromTo(
      ref.current,
      {
        width: 0, // Initial width: 0 (collapsed)
        opacity: 0, // Initial opacity: 0 (transparent)
      },
      {
        width: '100%', // Animate to full width
        opacity: 1, // Animate to fully visible
        delay: index / 10 + 0.35, // Stagger effect based on index
      },
    );
    tl.play(); // Play the animation

    // Reverse the animation if transitioning to close
    if (transition === 'close') {
      tl.reverse(index / 10 + 0.65); // Reverse with stagger based on index
    }

    return () => {
      tl.kill(); // Clean up the timeline on unmount or dependency change
    };
  }, [transition, open]); // Dependencies for re-running the animation

  // Form stage leaving animations
  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true, // Create a new GSAP timeline and pause it initially
    });

    // Define animation from hidden (width: 0, opacity: 0) to visible (width: 100%, opacity: 1)
    tl.fromTo(
      ref.current,
      {
        width: 0, // Initial width: 0 (collapsed)
        opacity: 0, // Initial opacity: 0 (transparent)
      },
      {
        width: '100%', // Animate to full width
        opacity: 1, // Animate to fully visible
        delay: index / 10 + 0.35, // Stagger effect based on index
      },
    );

    // Reverse the animation if the current stage is 'leaving' and the previous stage was 'none'
    if (stage === 'leaving' && prevStage === 'none') {
      tl.reverse(1); // Reverse the animation over 1 second
    }
    setPrevStage(stage); // Update the previous stage

    return () => {
      tl.kill(); // Clean up the timeline on unmount or dependency change
    };
  }, [stage]); // Dependency for re-running the animation

  // Render the component with the provided className and children
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default FormFieldAnimations;
