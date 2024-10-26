'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { FC, ReactNode } from 'react';
import { useRef } from 'react';

const ReviewAnimations: FC<{
  children: ReactNode;
  className: string;
  index: number;
  state: boolean;
}> = ({ children, className, index, state }) => {
  const ref = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    if (!state) {
      tl.to(ref.current, {
        height: 0,
        autoAlpha: 0,
        yPercent: -100,
        duration: 0.5,
        delay: index / 10,
      });
      tl.play();
    } else {
      tl.set(ref.current, {
        autoAlpha: 0,
        height: 0,
        yPercent: -100,
      }).to(ref.current, {
        autoAlpha: 1,
        height: 'auto',
        yPercent: 0,
        delay: index / 10,
      });
      tl.play();
    }

    return () => {
      tl.kill();
    };
  }, [state]);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

export default ReviewAnimations;
