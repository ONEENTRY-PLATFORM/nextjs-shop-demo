'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { JSX, ReactNode } from 'react';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Filter modal animations component
 * Uses GSAP library to animate the filter modal entrance and exit
 * @param   {object}      props          - component props
 * @param   {ReactNode}   props.children - children ReactNode elements to be animated
 * @returns {JSX.Element}                filter modal with entrance/exit animations
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const FilterModalAnimations = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  /** Get modal state from context */
  const { open, component, transition, setOpen, setTransition } =
    useContext(OpenDrawerContext);

  /** Reference to the modal container for GSAP animations */
  const ref = useRef(null);

  /**
   * GSAP animation effect for modal entrance and exit
   * Handles both opening and closing animations with timeline
   */
  useGSAP(() => {
    /** Exit early if modal is not open or not a FilterForm component */
    if (!open || component !== 'FilterForm') {
      return;
    }

    /** Create GSAP timeline with callbacks for completion events */
    const tl = gsap.timeline({
      paused: true,
      /** When animation completes (modal opened), clear transition state */
      onComplete: () => {
        setTransition('');
      },
      /** When animation reverses (modal closed), update state */
      onReverseComplete: () => {
        setOpen(false);
        setTransition('');
      },
    });

    /** Get modal background and body elements for animation */
    const modalBg =
      ref.current && (ref.current as HTMLDivElement).querySelector('#modalBg');
    const modalBody =
      ref.current &&
      (ref.current as HTMLDivElement).querySelector('#modalBody');

    /** Set initial states for animation */
    gsap.set(modalBg, {
      autoAlpha: 0,
      transformOrigin: 'right center',
    });

    gsap.set(modalBody, {
      xPercent: 100,
    });

    /** Define entrance animation sequence */
    tl.to(modalBg, {
      autoAlpha: 1,
      xPercent: 0,
      backdropFilter: 'blur(10px)',
      duration: 0.5,
    }).to(
      modalBody,
      {
        autoAlpha: 1,
        xPercent: 0,
        duration: 0.5,
      },
      '-0.25', // Start slightly before previous animation completes
    );

    /** Play or reverse animation based on transition state */
    if (transition === 'close') {
      tl.reverse(2);
    } else {
      tl.play();
    }

    /** Cleanup function to kill timeline on unmount */
    return () => {
      tl.kill();
    };
  }, [open, transition]);

  /** Don't render if modal is not open or not FilterForm component */
  if (!open || component !== 'FilterForm') {
    return <></>;
  }

  return (
    <div ref={ref} className="fixed left-0 top-0 z-50 flex h-screen w-full">
      {children}
    </div>
  );
};

export default FilterModalAnimations;
