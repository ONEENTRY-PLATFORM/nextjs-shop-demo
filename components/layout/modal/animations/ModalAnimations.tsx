'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { JSX, ReactNode } from 'react';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Modal open/close animations component.
 * Handles the animation logic for showing and hiding modals using GSAP.
 * @param   {object}      props           - Component properties
 * @param   {ReactNode}   props.children  - Child components to be animated
 * @param   {string}      props.component - Component name used to determine animation duration
 * @returns {JSX.Element}                 Modal wrapper with open/close animations
 */
const ModalAnimations = ({
  children,
  component,
}: {
  children: ReactNode;
  component: string;
}): JSX.Element => {
  /** Access the modal state from the OpenDrawerContext */
  const { open, transition, setOpen, setTransition } =
    useContext(OpenDrawerContext);
  /** Reference to the DOM element for GSAP animations */
  const ref = useRef(null);

  /** GSAP animation hook for modal open/close transitions */
  useGSAP(() => {
    /** Skip animations if ref is not available or modal is not open */
    if (!ref.current || !open) {
      return;
    }

    /** Create a GSAP timeline for coordinated animations */
    const tl = gsap.timeline({
      paused: true,
      /** Reset transition state when animation completes */
      onComplete: () => {
        setTransition('');
      },
      /** Close modal and reset transition state when reverse animation completes */
      onReverseComplete: () => {
        setOpen(false);
        setTransition('');
      },
    });

    /** Select modal background and body elements for animation */
    const modalBg = (ref.current as HTMLDivElement).querySelector('#modalBg');
    const modalBody = (ref.current as HTMLDivElement).querySelector(
      '#modalBody',
    );

    /** Handle closing animation */
    if (transition === 'close') {
      /** Different animation duration for CalendarForm component */
      const duration = component !== 'CalendarForm' ? 0.5 : 1.5;
      tl.to([modalBg, modalBody], {
        scaleX: 1,
        autoAlpha: 1,
        duration: duration,
      }).reverse(duration);
    }
    // Handle opening animation
    else {
      tl.set([modalBg, modalBody], {
        scaleX: 0,
        autoAlpha: 0,
      })
        .to([modalBg, modalBody], {
          scaleX: 1,
          autoAlpha: 1,
        })
        .to(modalBg, {
          backdropFilter: 'blur(10px)',
          delay: -0.35,
        });
      tl.play();
    }

    /** Cleanup function to kill the timeline on unmount */
    return () => {
      tl.kill();
    };
  }, [open, transition]);

  /** Don't render anything if the modal is not open */
  if (!open) {
    return <></>;
  }

  /** Render the animated modal wrapper */
  return (
    <div ref={ref} className="fixed z-50 flex h-screen w-full">
      {children}
    </div>
  );
};

export default ModalAnimations;
