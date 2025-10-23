'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { JSX, ReactNode } from 'react';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Calendar animations component for applying entrance and exit animations to calendar elements.
 * Uses GSAP to animate calendar components as they appear or disappear in a drawer context.
 * @param   {object}      props           - Props for CalendarAnimations.
 * @param   {ReactNode}   props.children  - children ReactNode.
 * @param   {string}      props.className - CSS className of ref element.
 * @returns {JSX.Element}                 Calendar animations.
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const CalendarAnimations = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}): JSX.Element => {
  /**
   * Get open and transition states from the OpenDrawerContext
   * These control the animation behavior of the calendar in the context of a drawer
   */
  const { open, transition } = useContext(OpenDrawerContext);

  /**
   * Reference to the DOM element for animations
   * This ref is used by GSAP to directly manipulate the DOM element
   */
  const ref = useRef(null);

  /**
   * Calendar transition animations using GSAP
   * Handles animations when the calendar is opened or closed in a drawer
   */
  useGSAP(() => {
    /**
     * If the reference is not set, exit early
     * Prevents errors when the component is not yet mounted
     */
    if (!ref.current) {
      return;
    }

    /**
     * Create a new GSAP timeline for the calendar animations
     * The timeline is paused initially to allow for precise control
     */
    const tl = gsap.timeline({
      paused: true,
    });

    /**
     * Define animation for calendar weekdays and buttons
     * Targets specific calendar elements using CSS selectors for detailed animation control
     */
    tl.fromTo(
      '.react-calendar__month-view__weekdays__weekday abbr, #modalBody > div button',
      {
        scale: 0,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        delay: 0.05,
        stagger: 0.01,
      },
    );

    /**
     * Reverse or play the animation based on transition state
     * This provides different animations for opening and closing the calendar
     */
    if (transition === 'close') {
      /** Reverse the animation over 2 seconds */
      tl.reverse(1.5);
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
  }, [transition, open]);

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

export default CalendarAnimations;
