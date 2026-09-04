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

    /**
     * Resolve the animated nodes from this component's own subtree.
     *
     * `#modalBody` and `#modalBg` are not unique in the document: the same two
     * ids are rendered by `Modal` and by `FilterModal`, so the bare
     * `'#modalBg, #modalBody'` selectors used here matched whichever copy came
     * first in document order — the mobile menu could animate another modal's
     * nodes and leave its own untouched. `ModalAnimations` and
     * `FilterModalAnimations` already resolve theirs through the wrapper ref;
     * this does the same.
     *
     * Note this cannot be solved with `useGSAP`'s `scope` option: the menu
     * body *is* the wrapper element, and a scope only matches its descendants.
     */
    const modalBody = ref.current as HTMLDivElement | null;
    const modalBg = modalBody?.querySelector('#modalBg') ?? null;
    const modalNodes = [modalBg, modalBody];

    /** Handle closing animation */
    if (transition === 'close') {
      tl.to(modalNodes, {
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
      /**
       * Hide synchronously, before first paint: a timeline's set() only
       * applies on the next GSAP tick, which can land after paint under
       * main-thread jank — the fully visible menu would flash before
       * being hidden and re-animated.
       */
      gsap.set(modalNodes, {
        xPercent: -150, // Initially position elements off-screen
        autoAlpha: 0, // Initially hide elements
      });
      tl.to(modalNodes, {
        xPercent: -50, // Move elements to their final position
        autoAlpha: 1, // Fade in elements
      })
        .to(modalBg, {
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
