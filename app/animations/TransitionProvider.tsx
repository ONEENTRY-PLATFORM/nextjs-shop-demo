'use client';

import { gsap } from 'gsap';
import { TransitionRouter } from 'next-transition-router';
import type { ReactNode } from 'react';
import { useRef } from 'react';

/**
 * Transition provider - main 'stage' transition provider
 *
 * @param children children ReactNode
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 * @see {@link https://github.com/ismamz/next-transition-router next-transition-router}
 * @returns TransitionRouter
 */
export default function TransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const ref = useRef(null);

  return (
    <TransitionRouter
      auto={true}
      leave={async (next) => {
        if (!ref.current) {
          return;
        }

        // Check if we're in browser environment before accessing window
        if (typeof window === 'undefined') {
          next();
          return;
        }

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

        return () => {
          tl.kill();
        };
      }}
      enter={async (next) => {
        if (!ref.current) {
          return;
        }

        // Check if we're in browser environment before accessing window
        if (typeof window === 'undefined') {
          next();
          return;
        }

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

        return () => {
          tl.kill();
        };
      }}
    >
      <div ref={ref}>{children}</div>
    </TransitionRouter>
  );
}
