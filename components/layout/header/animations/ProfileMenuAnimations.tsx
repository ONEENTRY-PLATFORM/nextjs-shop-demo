/* eslint-disable jsdoc/reject-any-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { JSX, ReactNode } from 'react';
import { useRef } from 'react';

/**
 * Profile menu animations component for handling entrance and exit animations of the profile menu.
 * Uses GSAP to animate the profile menu when it opens or closes based on state changes.
 * @param   {object}      props           - Profile menu animations props.
 * @param   {ReactNode}   props.children  - children ReactNode.
 * @param   {string}      props.className - CSS className of ref element.
 * @param   {any}         props.state     - state of component.
 * @param   {any}         props.setState  - setState of component function.
 * @returns {JSX.Element}                 Profile menu wrapper with animations.
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const ProfileMenuAnimations = ({
  children,
  className,
  state,
  setState,
}: {
  children: ReactNode;
  className: string;
  state: any;
  setState: any;
}): JSX.Element => {
  /**
   * Reference to the DOM element for animations
   * This ref is used by GSAP to directly manipulate the DOM element
   */
  const ref = useRef(null);

  /**
   * Animations triggered on state change using GSAP
   * Handles the opening and closing animations of the profile menu
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
     * Create a new GSAP timeline for the profile menu animations
     * The timeline is paused initially to allow for precise control
     */
    const tl = gsap.timeline({
      paused: true,
    });

    /**
     * Define animation from hidden (autoAlpha: 0, height: 0) to visible (autoAlpha: 1, height: auto)
     * This creates a smooth dropdown effect for the profile menu
     */
    tl.from(ref.current, {
      autoAlpha: 0, // Initial state: hidden and transparent
      height: 0, // Initial state: no height (collapsed)
    }).to(ref.current, {
      autoAlpha: 1, // Animate to visible state
      height: 'auto', // Animate to full height
      duration: 0.5, // Animation duration in seconds
    });

    /**
     * Play or reverse the animation based on the state
     * When state is true, play the opening animation
     * When state is false, reverse the animation for closing effect
     */
    if (state) {
      tl.play(); // Play the opening animation
    } else {
      tl.reverse(0.5); // Reverse the animation with a 0.5 second duration
    }

    /**
     * Clean up function to kill the timeline
     * Prevents memory leaks by ensuring animations are properly disposed
     */
    return () => {
      tl.kill(); // Clean up the timeline on unmount or dependency change
    };
  }, [state]); // Dependencies for re-running the animation when state changes

  /* Container element with ref attachment for GSAP animations */
  return (
    <div ref={ref} className={className} onMouseLeave={() => setState(false)}>
      {children}
    </div>
  );
};

export default ProfileMenuAnimations;
