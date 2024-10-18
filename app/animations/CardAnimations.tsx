'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { ReactNode } from 'react';
import { useRef } from 'react';

const CardAnimations = ({
  children,
  className,
  index,
}: {
  children: ReactNode;
  className: string;
  index: number;
}) => {
  const { stage } = useTransitionState();
  const ref = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    tl.set(ref.current, {
      autoAlpha: 0,
    }).to(ref.current, {
      autoAlpha: 1,
      delay: index / 20,
    });

    if (stage === 'leaving') {
      tl.reverse(1);
    }
    if (stage === 'entering') {
      tl.play();
    }
    tl.play();

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

export default CardAnimations;
