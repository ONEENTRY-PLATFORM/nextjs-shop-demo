'use client';

import { gsap } from 'gsap';
import { TransitionRouter } from 'next-transition-router';
import type { ReactNode } from 'react';
import { useRef } from 'react';

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
        const tl = await gsap
          .timeline()
          .to(ref.current, {
            height: (ref.current as HTMLDivElement).clientHeight,
            duration: 0.85,
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
        const tl = await gsap
          .timeline()
          .from(ref.current, {
            height: (ref.current as HTMLDivElement).clientHeight,
            duration: 0.25,
          })
          .to(ref.current, {
            height: 'auto',
            duration: 0.5,
          })
          .call(next, undefined, 0.65);

        return () => {
          tl.kill();
        };
      }}
    >
      <div ref={ref}>{children}</div>
    </TransitionRouter>
  );
}
