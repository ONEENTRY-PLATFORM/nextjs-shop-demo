'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { JSX, ReactNode } from 'react';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Mobile menu open/close animations component.
 * Handles the animation logic for showing and hiding the mobile menu using GSAP.
 * @param   {object}      props           - Component properties
 * @param   {ReactNode}   props.children  - Child components to be animated
 * @param   {string}      props.className - CSS className for the wrapper element
 * @param   {string}      props.id        - CSS id for the wrapper element
 * @returns {JSX.Element}                 Mobile menu wrapper with open/close animations
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const MobileMenuAnimations = ({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className: string;
  id: string;
}): JSX.Element => {
  /** Access the mobile menu open state and transition controls from context */
  const { open, transition, setOpen, setTransition } =
    useContext(OpenDrawerContext);
  /** Reference to the DOM element for GSAP animations */
  const ref = useRef(null);

  /** GSAP animation hook for mobile menu open/close transitions */
  useGSAP(() => {
    /** Skip animations if menu is not open */
    if (!open) {
      return;
    }

    /** Create a GSAP timeline for coordinated animations */
    const tl = gsap.timeline({
      paused: true,
    });

    /** Handle closing animation */
    if (transition === 'close') {
      tl.to('#modalBg, #modalBody', {
        xPercent: -150, // Move elements off-screen to the left
        autoAlpha: 0, // Fade out elements
        onComplete: () => {
          /** Reset transition state and close the menu */
          setTransition('');
          setOpen(false);
        },
      }).play();
    }
    // Handle opening animation
    else if (open) {
      tl.set('#modalBg, #modalBody', {
        xPercent: -150, // Initially position elements off-screen
        autoAlpha: 0, // Initially hide elements
      })
        .to('#modalBg, #modalBody', {
          xPercent: -50, // Move elements to their final position
          autoAlpha: 1, // Fade in elements
        })
        .to('#modalBg', {
          backdropFilter: 'blur(10px)', // Apply blur effect to background
          delay: -0.35, // Overlap with previous animation
        })
        .play();
    }

    /** Cleanup function to kill the timeline on unmount */
    return () => {
      tl.kill();
    };
  }, [open, transition]);

  /** Don't render anything if the menu is not open */
  if (!open) {
    return <></>;
  }

  /** Render the animated wrapper element */
  return (
    <div ref={ref} id={id} className={className}>
      {children}
    </div>
  );
};

export default MobileMenuAnimations;
