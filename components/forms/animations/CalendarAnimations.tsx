'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { FC, ReactNode } from 'react';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

interface CalendarAnimationsProps {
  children: ReactNode;
  className: string;
}

/**
 * Calendar animations
 *
 * @param children children ReactNode
 * @param className CSS className of ref element
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 * @returns Calendar animations
 */
const CalendarAnimations: FC<CalendarAnimationsProps> = ({
  children,
  className,
}) => {
  const { open, transition } = useContext(OpenDrawerContext); // Get open and transition states from context
  const ref = useRef(null); // Reference to the DOM element for animations

  // Form transition animations
  useGSAP(() => {
    if (!ref.current) {
      return; // If the reference is not set, exit early
    }

    const tl = gsap.timeline({
      paused: true, // Create a new GSAP timeline and pause it initially
    });

    // Define animation for calendar weekdays and buttons
    tl.fromTo(
      '.react-calendar__month-view__weekdays__weekday abbr, #modalBody > div button',
      {
        scale: 0, // Initial scale: 0 (hidden)
        opacity: 0, // Initial opacity: 0 (transparent)
      },
      {
        scale: 1, // Animate to full size
        opacity: 1, // Animate to fully visible
        delay: 0.15, // Delay before starting the animation
        stagger: 0.01, // Stagger effect for each element
      },
    );

    // Reverse or play the animation based on transition state
    if (transition === 'close') {
      tl.reverse(2); // Reverse the animation over 2 seconds
    } else {
      tl.play(); // Play the animation
    }

    return () => {
      tl.kill(); // Clean up the timeline on unmount or dependency change
    };
  }, [transition, open]); // Dependencies for re-running the animation

  // Render the component with the provided className and children
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default CalendarAnimations;
