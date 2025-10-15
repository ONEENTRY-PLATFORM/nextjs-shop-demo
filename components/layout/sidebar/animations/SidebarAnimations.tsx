'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { usePathname } from 'next/navigation';
import { useTransitionState } from 'next-transition-router';
import type { JSX } from 'react';
import { type ReactNode, useRef } from 'react';

/**
 * Sidebar animations component that handles slide-in/slide-out transitions for the sidebar menu.
 * Uses GSAP for smooth animations and integrates with next-transition-router for page transition awareness.
 * @param   {object}      props           - Sidebar animations props.
 * @param   {ReactNode}   props.children  - Children ReactNode to be rendered inside the animated container.
 * @param   {string}      props.className - CSS className to be applied to the container element.
 * @returns {JSX.Element}                 Sidebar animations component with transition effects.
 */
const SidebarAnimations = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}): JSX.Element => {
  /** Get the current transition stage (entering, leaving, idle) */
  const { stage } = useTransitionState();

  /** Reference to the DOM element for GSAP animations */
  const ref = useRef(null);

  /** Get current pathname to determine which pages should skip animations */
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path: unknown) => path);

  /**
   * GSAP animation effect that runs when the component mounts or when the transition stage changes.
   * Implements slide-in/slide-out animation for the sidebar menu.
   */
  useGSAP(() => {
    /** Skip animations for specific pages or if ref is not available */
    if (
      !ref.current ||
      pathNames[1] === 'profile' ||
      pathNames[1] === 'favorites' ||
      pathNames[1] === 'cart' ||
      pathNames[1] === 'payment' ||
      pathNames[1] === 'orders'
    ) {
      return;
    }

    /** Create a GSAP timeline for the sidebar animation */
    const tl = gsap.timeline({
      paused: true,
    });

    /** Initialize sidebar position off-screen to the left and animate it in */
    tl.set('.sidebar-menu', {
      xPercent: -100,
    }).to('.sidebar-menu', {
      xPercent: 0,
      duration: 0.7,
    });

    /** Play or reverse animation based on transition stage */
    if (stage === 'entering') {
      tl.play();
    } else if (stage === 'leaving') {
      tl.reverse(0.7);
    }

    /** Cleanup function to kill the timeline when component unmounts */
    return () => {
      tl.kill();
    };
  }, [stage]);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

export default SidebarAnimations;
