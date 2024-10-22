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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      leave={async (next, from, to) => {
        const tl = await gsap
          .timeline()
          .set(ref.current, {
            autoAlpha: 1,
          })
          .to(ref.current, {
            autoAlpha: 0,
            // delay: 0.35,
            duration: 0.5,
          })
          .call(next, undefined, 0.5);

        return () => {
          tl.kill();
        };
      }}
      enter={async (next) => {
        const tl = await gsap
          .timeline()
          .set(ref.current, {
            autoAlpha: 0,
          })
          .to(ref.current, {
            autoAlpha: 1,
            // height: 'auto',
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
