'use client';

import { gsap } from 'gsap';
import { TransitionRouter } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useRef } from 'react';

/**
 * Transition provider - main 'stage' transition provider
 * @param   {object}      props          - props
 * @param   {ReactNode}   props.children - children ReactNode
 * @returns {JSX.Element}                TransitionRouter
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 * @see {@link https://github.com/ismamz/next-transition-router next-transition-router}
 */
export default function TransitionProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  /** Reference to the container DOM element */
  const ref = useRef(null);

  /* Render the transition router with enter and leave animations */
  return (
    <TransitionRouter
      auto={true}
      leave={async (next) => {
        /** Exit early if ref is not available */
        if (!ref.current) {
          return;
        }

        /** Check if we're in browser environment before accessing window */
        if (typeof window === 'undefined') {
          next();
          return;
        }

        /** Create timeline for leave animation */
        const tl = await gsap
          .timeline()
          .to(window, {
            duration: 0.5,
            scrollTo: 0,
          })
          .to(ref.current, {
            height: (ref.current as HTMLDivElement).clientHeight,
            duration: 0.85,
            delay: -0.5,
          })
          .call(next, undefined, 0.75);

        /** Cleanup function to kill timeline on unmount */
        return () => {
          tl.kill();
        };
      }}
      enter={async (next) => {
        /** Exit early if ref is not available */
        if (!ref.current) {
          return;
        }

        /** Check if we're in browser environment before accessing window */
        if (typeof window === 'undefined') {
          next();
          return;
        }

        /** Create timeline for enter animation */
        const tl = await gsap
          .timeline()
          .set(ref.current, {
            height: (ref.current as HTMLDivElement).clientHeight,
          })
          .to(ref.current, {
            height: 'auto',
            duration: 0.5,
          })
          .call(next, undefined, 0.5);

        /** Cleanup function to kill timeline on unmount */
        return () => {
          tl.kill();
        };
      }}
    >
      <div ref={ref}>{children}</div>
    </TransitionRouter>
  );
}
